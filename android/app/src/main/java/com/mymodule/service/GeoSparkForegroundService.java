package com.mymodule.service;

import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;


public class GeoSparkForegroundService extends Service {

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForeground(NotificationHelper.NOTIFICATION_ID, NotificationHelper.showNotification(this));
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        NotificationHelper.cancelNotification(this);
    }

}