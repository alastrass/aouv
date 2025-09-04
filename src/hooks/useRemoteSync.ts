@@ .. @@
   const generateSessionCode = useCallback(() => {
     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
     let result = '';
-    for (let i = 0; i < 6, i < 6; i++) {
+    for (let i = 0; i < 6; i++) {
       result += chars.charAt(Math.floor(Math.random() * chars.length));
     }
     return result;
   }, []);