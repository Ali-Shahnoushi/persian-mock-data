# Persian Mock Data Factory

[English documentation](./README.en.md)

کتابخانه‌ای مستقل از فریم‌ورک و نوشته‌شده با TypeScript برای تولید داده‌های
آزمایشی ایرانی، سناریوهای نامعتبر نام‌گذاری‌شده و داده‌های قابل بازتولید با
`seed`.

> این پروژه داده‌هایی تولید می‌کند که از **قواعد قالب و الگوریتم مستندشده**
> عبور می‌کنند. خروجی به معنای وجود شخص واقعی، فعال بودن شماره تلفن، ثبت رسمی
> کد ملی یا قابل تحویل بودن نشانی و کد پستی نیست.

## وضعیت پروژه

هسته نسخه `0.1.0` پیاده‌سازی شده است، اما پکیج هنوز در npm منتشر نشده. برای
استفاده در توسعه:

```bash
git clone https://github.com/Ali-Shahnoushi/persian-mock-data.git
cd persian-mock-data
npm install
npm run build
```

خروجی build شامل ESM، CommonJS و فایل‌های type declaration است و به React،
Vue، Angular، Next.js یا فریم‌ورک دیگری وابستگی ندارد.

## شروع سریع

### تولید یک فرم معتبر و قابل بازتولید

```ts
import { persianMock } from "persian-mock-data";

const user = persianMock.generate(
  {
    fullName: { type: "person.fullName" },
    mobile: { type: "phone.mobile" },
    landline: { type: "phone.landline" },
    nationalId: { type: "identity.nationalId" },
    postalCode: { type: "address.postalCode" },
  },
  { seed: 1405 },
);
```

همان schema با همان `seed` همیشه همان خروجی را تولید می‌کند. تمام فیلدهای یک
schema از یک جریان تصادفی مشترک استفاده می‌کنند.

### تولید داده نامعتبر هدفمند

```ts
const invalidId = persianMock.field("identity.nationalId", {
  mode: "invalid",
  scenario: "wrong-checksum",
  seed: 1405,
});

const explained = persianMock.case("phone.mobile", {
  mode: "invalid",
  scenario: "persian-digits",
  seed: 1405,
});
```

`field` مقدار خام و `case` مقدار همراه با `expectedValid`، نام سناریو و
`violatedRule` را برمی‌گرداند. برای تمام حالت‌های مرزی یک فیلد:

```ts
const cases = persianMock.edgeCases("address.postalCode", 1405);
```

## API عمومی

| API | کاربرد |
| --- | --- |
| `persianMock.generate(schema, options)` | تولید object هم‌شکل با فرم |
| `persianMock.field(type, options)` | تولید مقدار خام یک فیلد |
| `persianMock.case(type, options)` | تولید مقدار همراه با فراداده اعتبار |
| `persianMock.edgeCases(type, seed)` | تولید همه سناریوهای نامعتبر یک فیلد |
| `generateFirstName`، `generateLastName`، `generateFullName` | نام‌های فارسی ساختگی |
| `generateMobile`، `generateLandline` | تلفن همراه و ثابت |
| `generateNationalId`، `generatePostalCode` | کد ملی و کد پستی |
| `validateMobile`، `validateLandline` | بررسی قالب و پیش‌شماره پشتیبانی‌شده |
| `validateNationalId`، `validatePostalCode` | بررسی قواعد مستندشده |
| `createRandom(seed)` | منبع تصادفی deterministic برای ترکیب APIها |

نوع‌های فیلد پشتیبانی‌شده:

```ts
type FieldType =
  | "person.firstName"
  | "person.lastName"
  | "person.fullName"
  | "phone.mobile"
  | "phone.landline"
  | "identity.nationalId"
  | "address.postalCode";
```

## قراردادهای اعتبارسنجی

### کد ملی

تابع `validateNationalId` دقیقاً قرارداد مرجع صاحب پروژه را اجرا می‌کند:

- ورودی باید دقیقاً ۱۰ رقم ASCII باشد.
- `0000000000` و ارقام تکراری `2222222222` تا `9999999999` رد می‌شوند.
- ۹ رقم اول با وزن‌های ۱۰ تا ۲ جمع می‌شوند.
- اگر `weightedSum % 11` کمتر از ۲ باشد، رقم کنترل همان باقیمانده است؛ در غیر
  این صورت رقم کنترل `11 - remainder` است.
- مقدار `1111111111` مطابق تابع مرجع **پذیرفته می‌شود** و برای این رفتار تست
  رگرسیون وجود دارد.

این کتابخانه عمداً سیاست سخت‌گیرانه دیگری را به‌صورت بی‌صدا اعمال نمی‌کند.

### موبایل

شماره داخلی ۱۱ رقمی با ارقام ASCII و یکی از پیش‌شماره‌های موجود در
`MOBILE_PREFIXES` پذیرفته می‌شود. فهرست صریح export شده تا سیاست پشتیبانی قابل
مشاهده و قابل به‌روزرسانی باشد.

### تلفن ثابت

قالب داخلی ۱۱ رقمی شامل کد منطقه سه‌رقمی پشتیبانی‌شده و شماره مشترک هشت‌رقمی
است. رقم اول شماره مشترک بین ۲ تا ۸ است. `generateLandline` علاوه بر `value`،
`areaCode` و `province` سازگار با آن را برمی‌گرداند.

### کد پستی

سیاست format-level کتابخانه ده رقم ASCII است و در پنج رقم اول `0` و `2`
پذیرفته نمی‌شود. این بررسی تخصیص رسمی یا قابل تحویل بودن کد را ثابت نمی‌کند.

## سناریوهای نامعتبر

| فیلد | سناریوها |
| --- | --- |
| نام‌ها | `empty`، `whitespace`، `too-long`، `invisible-character` |
| موبایل | `missing-leading-zero`، `unsupported-prefix`، `too-short`، `non-numeric`، `persian-digits` |
| تلفن ثابت | `missing-leading-zero`، `unsupported-area`، `too-short`، `non-numeric`، `persian-digits` |
| کد ملی | `wrong-checksum`، `wrong-length`، `non-numeric`، `persian-digits`، `forbidden-repeated` |
| کد پستی | `wrong-length`، `non-numeric`، `invalid-prefix`، `persian-digits` |

TypeScript انتخاب scenario ناسازگار با نوع فیلد را هنگام توسعه رد می‌کند؛ API
در runtime نیز ورودی ناسازگار را با `RangeError` متوقف می‌کند.

## توسعه و بررسی

```bash
npm run check
```

این دستور type-check، تمام تست‌ها و build نهایی را اجرا می‌کند. تست‌ها رفتار
مرزی `1111111111`، رد ارقام فارسی در فیلدهای ASCII، تمام سناریوهای نامعتبر و
ثبات خروجی seed شده را پوشش می‌دهند.

برنامه مرحله‌ای در [docs/IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md)
ثبت شده است.

## مجوز

[MIT](./LICENSE)
