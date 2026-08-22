# AquaTrace Operations Dashboard

Web dashboard for rescue divers and admins to view ghost-net reports on a
map, claim/resolve them, and (admins only) delete reports. Shares the
same Firebase project (aqua-trace-tn) as the AquaTrace mobile app.

## Creating your first admin account

1. Sign up as a diver through the mobile app.
2. In Firebase Console → Firestore Database → users collection → find
   that account's document.
3. Edit the role field from "diver" to "admin".
4. Sign in to this dashboard with that account.
