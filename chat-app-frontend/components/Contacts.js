// import { StyleSheet, Text, View, ScrollView } from "react-native";
// import React, { useState, useEffect } from "react";

// import * as Contacts from "expo-contacts";

// const ContactsComp = () => {
//   const [contacts, setContacts] = useState([]);
//   useEffect(() => {
//     (async () => {
//       const { status } = await Contacts?.requestPermissionsAsync();
//       if (status === "granted") {
//         const { data } = await Contacts.getContactsAsync({
//           fields: [Contacts.Fields.Emails],
//         });

//         if (data.length > 0) {
//           setContacts(data);
//           const contact = data[0];
//           console.log(contact);
//         }
//       }
//     })();
//   }, []);
//   console.log(contacts);
//   return (
//     <View>
//       <Text>Contacts</Text>
//     </View>
//   );
// };

// export default ContactsComp;

// const styles = StyleSheet.create({});
