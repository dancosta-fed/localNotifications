import { StatusBar } from 'expo-status-bar';
import { Button, Platform, Text, View } from 'react-native';
import { styles } from './styles';
import notifee, { AndroidImportance, EventType, TimestampTrigger, TriggerNotification, TriggerType }  from '@notifee/react-native'
import { useEffect } from 'react';

export default function App() {

  const createChannelId = async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'medicamentos',
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    return channelId;
  };

  const displayNotification = async () => {
    await notifee.requestPermission();

    const channelId = await createChannelId();

    await notifee.displayNotification({
      id: 'notification-id',
      title: 'Olá, Dan Costa!',
      body: 'Esta é minha notificação teste... ela é gigante e vamos ver o que vai aparecer quando for gerada...',
      ios: { 
        targetContentId: channelId,
        interruptionLevel: 'timeSensitive',
        sound: 'default'
      },
      android: { 
        channelId ,
        sound: 'default'
      },
    });

    notifee.setBadgeCount(1).then(() => console.log('Badge count set!'));
  };

  const updateNotification = async () => {
    await notifee.requestPermission();

    const channelId = await createChannelId();

    await notifee.displayNotification({
      id: 'notification-id',
      title: 'Olá, Rhaiany!',
      body: 'Esta é minha notificação teste... ela é gigante e vamos ver o que vai aparecer quando for gerada...',
      ios: { 
        targetContentId: channelId,
        sound: 'default'
      },
      android: { 
        channelId ,
        sound: 'default'
      },
    });
  };

  const cancelNotification = async () => {
    await notifee.cancelNotification('notification-id');
  };

  const scheduledNotification = async () => {
    await notifee.requestPermission();
    const channelId = await createChannelId();
    const date = new Date(Date.now());

    date.setMinutes(date.getMinutes() + 1); // 1 minute from now

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    await notifee.createTriggerNotification({
      title: 'Notificação Agendada ⏳',
      body: 'Esta é minha AGENDADA! Uma notificação teste...',
      ios: { 
        targetContentId: channelId,
        sound: 'default'
      },
      android: { 
        channelId ,
        sound: 'default'
      },
    }, trigger);
  };

  const listScheduledNotifications = async () => {
    const notifications = await notifee.getTriggerNotificationIds()
    console.log(notifications);
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {

      if (Platform.OS === 'ios') {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
  
          case EventType.PRESS:
            console.log('IOS foreground: User took action pressed notification', detail.pressAction);
            notifee.setBadgeCount(0).then(() => console.log('Badge count removed!'));
            break;
        
          default:
            break;
        }
      } else {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
  
          case EventType.PRESS:
            console.log('ANDROID foreground: User took action pressed notification', detail.notification);
            notifee.setBadgeCount(0).then(() => console.log('Badge count removed!'));
            break;
        
          default:
            break;
        }
      }
    });
  }, []);

  useEffect(() => {
    return notifee.onBackgroundEvent( async ({ type, detail }) => {
      if (Platform.OS === 'ios') {
        if (type === EventType.PRESS) {
          notifee.setBadgeCount(0).then(() => console.log('Badge count removed!'));
          console.log('IOS background: User pressed notification', detail.pressAction);
        };
      } else {
        if (type === EventType.PRESS) {
          console.log('ANDROID background: User pressed notification', detail.notification);
          notifee.setBadgeCount(0).then(() => console.log('Badge count removed!'));
        };
      }

    });
  }, []);

  useEffect(() => {
    // App launched, remove the badge count
    notifee.setBadgeCount(0).then(() => console.log('Badge count removed'));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Local Notifications</Text>
      <StatusBar style="auto" />

      <View style={styles.button} >
        <Button color={''} title='Send Notification' onPress={displayNotification}/>
      </View>

      <View style={styles.button} >
        <Button color={'green'} title='Update Notification' onPress={updateNotification}/>
      </View>

      <View style={styles.button} >
        <Button color={'red'} title='Cancel Notification' onPress={cancelNotification}/>
      </View>

      <View style={styles.button} >
        <Button color={'purple'} title='Schedule Notification' onPress={scheduledNotification}/>
      </View>

      <View style={styles.button} >
        <Button color={'orange'} title='List Notification' onPress={listScheduledNotifications}/>
      </View>
    </View>
  );
}
