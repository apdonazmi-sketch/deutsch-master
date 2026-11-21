# تثبيت Deutsch Master على أندرويد

التطبيق = Next.js + Postgres + API (مش ملفات ثابتة)، فلازم يتنشر على سيرفر HTTPS، والـ APK بيفتح الموقع ده.

## 1) النشر (إلزامي) — الجداول بتتعمل تلقائيًا عند التشغيل (npm run start:prod)
- أنشئ قاعدة Postgres (Neon / Supabase / Railway) وخد الـ DATABASE_URL.
- انشر المشروع على Railway أو Render، بالمتغيرات الموجودة في `.env.example`.
- أنشئ الجداول مرة واحدة: عدّل الرابط في `drizzle.config.json` لقاعدتك ثم شغّل `npx drizzle-kit push`.
- لازم HTTPS: كوكي الجلسة في الإنتاج `Secure` + `SameSite=None` ومش هيشتغل على http.

## 2) أسهل طريقة: تثبيت PWA بدون APK
افتح الرابط في Chrome على الموبايل ← ⋮ ← "تثبيت التطبيق".

## 3) استخراج APK (من غير Android Studio)
1. ادخل https://www.pwabuilder.com وحط رابط الموقع.
2. اختار Android ← Generate (بيعمل TWA).
3. نزّل الـ ZIP: فيه ملف APK موقّع + ملف keystore + assetlinks.json. احتفظ بالـ keystore.
4. حط assetlinks.json على: `https://دومينك/.well-known/assetlinks.json` (عشان يختفي شريط المتصفح).
5. انقل الـ APK للموبايل ← فعّل "تثبيت من مصادر غير معروفة" ← ثبّته.

بديل: `npx @bubblewrap/cli init --manifest https://دومينك/manifest.webmanifest` ثم `bubblewrap build` (محتاج JDK 17 وAndroid SDK).

## ملاحظات
- TWA بيستخدم Chrome، فالتعرّف على الصوت (SpeechRecognition) والنطق بيشتغلوا. تجنّب WebView/Capacitor لأن التعرّف على الصوت مش بيشتغل فيه.
- من غير `OPENAI_API_KEY` المدرّس بيشتغل بمحرك القواعد الداخلي.
