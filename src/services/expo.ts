import Expo from 'expo-server-sdk';

const expo = new Expo();

export const sendPush = async (message: string, pushToken: string) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return null;
  }
  const notification: any = {
    to: pushToken,
    sound: 'default',
    title: 'Message received!',
    body: message,
    data: { message }
  };
  const chunks = expo.chunkPushNotifications([notification]);
  const receipts = await expo.sendPushNotificationsAsync(chunks[0]);
  console.log(receipts);
  return receipts;
};
