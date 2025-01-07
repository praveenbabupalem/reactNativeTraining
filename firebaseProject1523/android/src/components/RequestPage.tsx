import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import React from 'react';
import {PermissionsAndroid} from 'react-native';

export default function RequestPage() {
  const getNotificationPermissions = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  };
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={getNotificationPermissions}>
        <Text>Check Notification Permissions</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
