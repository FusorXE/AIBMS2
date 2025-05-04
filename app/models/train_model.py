import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import numpy as np
import pandas as pd
import joblib
import os
from datetime import datetime

class BatteryHealthModel:
    def __init__(self, model_path=None):
        self.model = None
        self.scaler = StandardScaler()
        self.model_path = model_path or "models/battery_health"
        self.feature_columns = [
            'voltage', 'current', 'temperature', 'soc',
            'cycle_count', 'time_since_last_charge',
            'charging_rate', 'discharge_rate',
            'max_voltage', 'min_voltage',
            'max_temperature', 'min_temperature'
        ]
        self.target_columns = [
            'health_score', 'remaining_capacity',
            'estimated_lifetime', 'failure_probability'
        ]

    def prepare_data(self, data: pd.DataFrame):
        """
        Prepare data for training with feature engineering
        """
        # Feature engineering
        data['charging_rate'] = data['current'].where(data['current'] > 0, 0)
        data['discharge_rate'] = data['current'].where(data['current'] < 0, 0).abs()
        
        # Calculate rolling statistics
        for col in ['voltage', 'temperature']:
            data[f'max_{col}'] = data[col].rolling(window=10).max()
            data[f'min_{col}'] = data[col].rolling(window=10).min()
        
        # Select features
        features = data[self.feature_columns]
        targets = data[self.target_columns]
        
        # Scale features
        X = self.scaler.fit_transform(features)
        y = targets.values
        
        return train_test_split(X, y, test_size=0.2, random_state=42)

    def build_model(self, input_shape):
        """
        Build a more sophisticated neural network model
        """
        inputs = tf.keras.Input(shape=(input_shape,))
        
        x = tf.keras.layers.Dense(256, activation='relu')(inputs)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        
        x = tf.keras.layers.Dense(128, activation='relu')(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        
        x = tf.keras.layers.Dense(64, activation='relu')(x)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.Dropout(0.3)(x)
        
        outputs = tf.keras.layers.Dense(len(self.target_columns))(x)
        
        model = tf.keras.Model(inputs=inputs, outputs=outputs)

        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae', tf.keras.metrics.RootMeanSquaredError()]
        )
        
        return model

    def train(self, data: pd.DataFrame, epochs: int = 100, batch_size: int = 32):
        """
        Train the model with callbacks for early stopping and model checkpointing
        """
        X_train, X_test, y_train, y_test = self.prepare_data(data)
        
        # Create model directory if it doesn't exist
        os.makedirs(self.model_path, exist_ok=True)
        
        # Callbacks
        checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
            filepath=os.path.join(self.model_path, 'best_model.h5'),
            save_best_only=True,
            monitor='val_loss',
            mode='min'
        )
        
        early_stopping_callback = tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
        
        self.model = self.build_model(X_train.shape[1])
        
        history = self.model.fit(
            X_train, y_train,
            validation_data=(X_test, y_test),
            epochs=epochs,
            batch_size=batch_size,
            verbose=1,
            callbacks=[checkpoint_callback, early_stopping_callback]
        )
        
        # Evaluate model
        test_loss, test_mae, test_rmse = self.model.evaluate(X_test, y_test)
        print(f"\nTest MAE: {test_mae:.4f}")
        print(f"Test RMSE: {test_rmse:.4f}")
        
        # Save best model and scaler
        self.save_model()
        
        return history

    def save_model(self):
        """
        Save the trained model and scaler
        """
        # Save model architecture and weights
        self.model.save(os.path.join(self.model_path, 'model.h5'))
        
        # Save scaler
        joblib.dump(self.scaler, os.path.join(self.model_path, 'scaler.pkl'))
        
        # Save feature and target column names
        with open(os.path.join(self.model_path, 'columns.txt'), 'w') as f:
            f.write(','.join(self.feature_columns) + '\n')
            f.write(','.join(self.target_columns))

    def load_model(self):
        """
        Load a pre-trained model
        """
        try:
            self.model = tf.keras.models.load_model(os.path.join(self.model_path, 'model.h5'))
            self.scaler = joblib.load(os.path.join(self.model_path, 'scaler.pkl'))
            
            # Load column names
            with open(os.path.join(self.model_path, 'columns.txt'), 'r') as f:
                self.feature_columns = f.readline().strip().split(',')
                self.target_columns = f.readline().strip().split(',')
                
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise

    def predict(self, data: pd.DataFrame):
        """
        Make predictions using the trained model
        """
        # Prepare features
        features = data[self.feature_columns]
        X = self.scaler.transform(features)
        
        # Make predictions
        predictions = self.model.predict(X)
        
        # Create prediction DataFrame
        pred_df = pd.DataFrame(predictions, columns=self.target_columns)
        pred_df['battery_id'] = data['battery_id']
        pred_df['timestamp'] = datetime.utcnow()
        
        return pred_df

    def evaluate_model(self, test_data: pd.DataFrame):
        """
        Evaluate model performance on test data
        """
        X_test = self.scaler.transform(test_data[self.feature_columns])
        y_test = test_data[self.target_columns].values
        
        predictions = self.model.predict(X_test)
        
        # Calculate metrics
        metrics = {}
        for i, target in enumerate(self.target_columns):
            y_true = y_test[:, i]
            y_pred = predictions[:, i]
            
            metrics[target] = {
                'mse': mean_squared_error(y_true, y_pred),
                'mae': mean_absolute_error(y_true, y_pred),
                'rmse': np.sqrt(mean_squared_error(y_true, y_pred))
            }
        
        return metrics

    def get_feature_importance(self):
        """
        Get feature importance using permutation importance
        """
        if not hasattr(self, 'feature_importance_'):
            # Create dummy data for feature importance calculation
            X_dummy = np.zeros((100, len(self.feature_columns)))
            y_dummy = np.zeros((100, len(self.target_columns)))
            
            # Calculate baseline loss
            baseline_loss = self.model.evaluate(X_dummy, y_dummy, verbose=0)[0]
            
            feature_importance = {}
            for i, feature in enumerate(self.feature_columns):
                # Shuffle feature
                X_shuffled = X_dummy.copy()
                np.random.shuffle(X_shuffled[:, i])
                
                # Calculate loss with shuffled feature
                shuffled_loss = self.model.evaluate(X_shuffled, y_dummy, verbose=0)[0]
                
                # Calculate importance as increase in loss
                feature_importance[feature] = shuffled_loss - baseline_loss
            
            self.feature_importance_ = feature_importance
        
        return self.feature_importance_
