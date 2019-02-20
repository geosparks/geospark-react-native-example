package com.mymodule.firebase;


import com.geospark.lib.GeoSpark;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;

public class MyFireBaseMessagingService extends FirebaseInstanceIdService {
    @Override
    public void onTokenRefresh() {
        String token = FirebaseInstanceId.getInstance().getToken();
        if (token != null) {
            GeoSpark.setDeviceToken(getApplicationContext(), token);
        }
    }
}

