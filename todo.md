# Nitiniyom Law - Project TODO

## Phase 1: Database Schema + API
- [x] ออกแบบและสร้าง schema: clients, cases, appointments, contacts, invoices
- [x] รัน migration SQL
- [x] สร้าง tRPC routers สำหรับทุก feature

## Phase 2: Landing Page
- [x] ออกแบบ global theme (สีทอง/กรมท่า, font Sarabun/Playfair)
- [x] Hero section พร้อม CTA
- [x] About / History section
- [x] Services section (6 บริการ)
- [x] Contact section พร้อมฟอร์มส่งข้อความ
- [x] Footer พร้อมข้อมูลติดต่อ
- [x] Navigation bar responsive

## Phase 3: CRM System (Admin Only)
- [x] หน้า Clients - รายชื่อลูกค้า, เพิ่ม/แก้ไข/ลบ
- [x] หน้า Cases - จัดการเคสคดี, สถานะ, ประเภทคดี
- [x] หน้า Appointments - ปฏิทินนัดหมาย, เพิ่ม/แก้ไข
- [x] หน้า Contacts - ข้อความจากฟอร์มหน้าเว็บ
- [x] หน้า Invoices - จัดการใบแจ้งหนี้/รายได้

## Phase 4: Sales Dashboard (Admin Only)
- [x] Overview cards (ลูกค้าทั้งหมด, เคสใหม่, รายได้, นัดหมาย)
- [x] กราฟรายได้รายเดือน (Bar chart - Recharts)
- [x] กราฟประเภทคดี (Pie chart - Recharts)
- [x] ตารางเคสล่าสุด
- [x] ตารางนัดหมายวันนี้

## Phase 5: Auth & Polish
- [x] ระบบ Login สำหรับเจ้าหน้าที่ (Manus OAuth)
- [x] Protected routes สำหรับ admin (role-based)
- [x] ตกแต่ง UI/UX ให้หรูหรา elegant (Navy + Gold theme)
- [x] Responsive design ทุกหน้า
- [x] Animation และ micro-interactions
- [x] Vitest unit tests (17 tests passed)


## Phase 6: Team/Organization Structure Page
- [x] สร้างหน้า Team - แสดงข้อมูลสมาชิกทีมงาน
- [x] เพิ่ม placeholder สำหรับรูปภาพสมาชิก
- [x] เพิ่ม Team link ในเมนู Navigation
- [x] ใช้ธีมเดียวกัน (Navy + Gold)

## Phase 7: Blog/Articles
- [x] สร้าง articles table ในฐานข้อมูล
- [x] สร้าง query helpers ใน server/db.ts
- [x] สร้าง tRPC routes สำหรับ articles (public + admin)
- [x] สร้างหน้า Blog listing
- [x] สร้างหน้า Blog detail
- [x] เพิ่ม Blog link ในเมนู Navigation
- [x] Responsive design (mobile + desktop)
- [x] Tests ผ่านทั้งหมด 17/17




## Phase 8: Team Page Refinement
- [x] เล็กลงตัวหนังสือในส่วน Team Members
- [x] เพิ่มข้อมูลประวัติการศึกษา (Education section)
  - [x] นิยม ดีจันทึก: มหาวิทยาลัยรามคำแหง
  - [x] ภัคจิรา นาคพลกรัง: มหาวิทยาลัยขอนแก่น เกรียรตินิยมอันดับ 1
- [x] ลบพื้นที่รูปภาพ placeholder
- [x] เพิ่มส่วน PARTNER
  - [x] นาย ธนกร คูณตุ้ม (ทนายความ)
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 9: Blog Content Addition
- [x] เพิ่มบทความเรื่องกฎหมายการแต่งงาน EP377
  - [x] หัวข้อ: "เล่ากฎหมาย EP377: ตกลงจะแต่งงานแต่เบี้ยวงานแต่ง ต้องชดใช้ไหม!"
  - [x] จัดรูปแบบให้น่าอ่าน: ใช้ emoji, heading, blockquote, list
  - [x] หมวดหมู่: "กฎหมายครอบครัว"
  - [x] ผู้เขียน: "นิยม ดีจันทึก"
  - [x] สถานะ: published
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 10: Team Page Structure Update
- [x] เปลี่ยนชื่อเมนู "ทีมงานของเรา" เป็น "โครงสร้างขององค์กร"
  - [x] อัปเดตเมนู Desktop และ Mobile
  - [x] เพิ่มข้อมูลการศึกษาของนาย ธนกร คูณตุ้ม (มหาวิทยาลัยรามคำแหง)
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 11: Add Second Partner
- [x] เพิ่มข้อมูล PARTNER ใหม่: ยศกร กันภัย
  - [x] ตำแหน่ง: ทนายความ
  - [x] การศึกษา: มหาวิทยาลัยรามคำแหง
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 12: Update Partner Positions
- [x] เปลี่ยนตำแหน่งของ ธนกร คูณตุ้ม เป็น "ผู้ช่วยทนายความ"
- [x] เปลี่ยนตำแหน่งของ ยศกร กันภัย เป็น "ทนายความและที่ปรึกษาสำนักงาน"
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 13: Add Expertise to Partners
- [x] เพิ่มความเชี่ยวชาญให้กับ ธนกร คูณตุ้ม
  - [x] กฎหมายแพ่ง
  - [x] กฎหมายวิธีพิจารณาแพ่ง
  - [x] คดีครอบครัว
- [x] เพิ่มความเชี่ยวชาญให้กับ ยศกร กันภัย
  - [x] กฎหมายแพ่ง
  - [x] การจดนิติบุคคล
  - [x] การทำนิติกรรม
- [x] เพิ่มการแสดงผลความเชี่ยวชาญในหน้า Team
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 14: Add Article EP376
- [x] เพิ่มบทความ EP376 เรื่อง "บุกรุกที่สาธารณะ"
  - [x] เนื้อหาเกี่ยวกับกฎหมายอาญามาตรา 362 และ 365
  - [x] กรณีศึกษา: แม่น้ำนครนายกตื้นเขินจนกลายเป็นที่ดิน
  - [x] คำพิพากษาศาลฎีกาที่ 1163/2562
  - [x] ข้อควรระวัง: ไม่ผิดฐานบุกรุกแต่อาจผิดกฎหมายอื่น
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 15: Add Article - Loan Denial Rights
- [x] เพิ่มบทความ "วิเคราะห์เจาะลึก: กู้ไม่ผ่าน... สิทธิ์ทางกฎหมายในการขอคืน"
  - [x] เนื้อหาเกี่ยวกับเงินจอง เงินทำสัญญา เงินดาวน์
  - [x] หลักกฎหมาย: ป.พ.พ. มาตรา 377, 378, 391
  - [x] พ.ร.บ. ว่าด้วยข้อสัญญาที่ไม่เป็นธรรม พ.ศ. 2540
  - [x] สรุปสิทธิ์ของผู้ซื้อ
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 16: Add Article - Niti Kram Am Prang
- [x] เพิ่มบทความ "นิติกรรมอำพราง: บทเรียนจากคำพิพากษาฎีกาที่ ๓๕๓๗/๒๕๖๖"
  - [x] เนื้อหาเกี่ยวกับการทำสัญญาขายฝากที่เป็นการกู้ยืมจริง
  - [x] พฤติการณ์พิรุธที่บ่งชี้เจตนาลวง
  - [x] คำวินิจฉัยของศาลและผลทางกฎหมาย
  - [x] บทสรุปและข้อเตือนสำหรับเจ้าหนี้
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 17: Add Article - Juristic Person Registration
- [x] เพิ่มบทความ "ขั้นตอนการจดทะเบียนนิติบุคคล"
  - [x] คำอธิบายนิติบุคคล
  - [x] ประเภทของนิติบุคคล (บริษัทจำกัด ห้างหุ้นส่วน)
  - [x] ขั้นตอนการจดทะเบียน 6 ขั้น
  - [x] เอกสารที่ต้องเตรียม
  - [x] ระยะเวลาและค่าใช้จ่าย
  - [x] ข้อแนะนำสำคัญ
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 18: Blog Page Color Redesign
- [x] ปรับปรุงโทนสีของหน้า Blog
  - [x] Header: Gradient แดง-น้ำเงิน พร้อมหัวข้อสีทอง (amber-300)
  - [x] Category badges: สีแดง น้ำเงิน ทอง พร้อม border
  - [x] Article titles: สีทอง (amber-700) เพิ่มความเป็นมืออาชีพ
  - [x] CTA Section: Gradient เดียวกับ Header พร้อมปุ่มสีทอง
  - [x] Background pattern: ลายทองอ่อน
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 19: Blog Page Luxury Redesign
- [x] ปรับปรุงโทนสีของหน้า Blog (เวอร์ชันหรูหรา)
  - [x] Header: Gradient น้ำเงิน-สเลต พร้อมเส้นทองและลวดลาย
  - [x] Category badges: สีน้ำเงิน-ทอง พร้อม border ละเอียด
  - [x] Article cards: ขาว/ทึ่มพร้อม hover effect ที่หรูหรา
  - [x] Article titles: สีน้ำเงิน-เข้มเปลี่ยนเป็นทองเมื่อ hover
  - [x] CTA Section: Gradient น้ำเงิน-สเลต พร้อมมุมตกแต่ง
  - [x] Background: ลวดลายจุดทองอ่อน + ไล่ระดับสีอ่อน
  - [x] Decorative elements: เส้นทอง, มุมตกแต่ง, ลวดลาย
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 20: Update Contact Email
- [x] แก้ไขข้อมูลอีเมลในส่วน Contact Info
  - [x] เปลี่ยนเป็น niyomphakjira@gmail.com
  - [x] เพิ่มลิงก์ mailto: เพื่อให้คลิกได้โดยตรง
  - [x] ปรับสไตล์ให้สอดคล้องกับโทรศัพท์ (gold-gradient background)
  - [x] เพิ่ม hover effect
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 21: Add Email Notification System
- [x] สร้างไฟล์ email.ts สำหรับส่งอีเมล
  - [x] ใช้ Manus built-in email service
  - [x] สร้างฟังก์ชัน sendEmail() พร้อม error handling
- [x] แก้ไข contact.submit mutation
  - [x] เพิ่มการส่งอีเมลไปยัง niyomphakjira@gmail.com
  - [x] สร้าง HTML template สำหรับอีเมล
  - [x] ส่งข้อมูลผู้ติดต่อ บริการ และข้อความ
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 22: Add Article - Fong Chu Evidence
- [x] เพิ่มบทความ "⚖️ ฟ้องชู้ ต้องมีหลักฐานอะไรบ้าง?"
  - [x] อธิบายหลักฐานแสดงความสัมพันธ์ (รูปถ่าย ข้อความแชท โซเชียล)
  - [x] อธิบายหลักฐานแสดงว่าชู้รู้สถานะการสมรส (พยาน เอกสาร)
  - [x] อธิบายหลักฐานการแสดงตนโดยเปิดเผย (เงิน การเดินทาง ที่พัก)
  - [x] ระบุเอกสารสำคัญที่ต้องมี (ทะเบียนสมรส บัตรประชาชน)
- [x] Tests ผ่านทั้งหมด 17/17

## Phase 23: Add Article - Misrepresentation with Negligence
- [x] เพิ่มบทความ "🎯 การแสดงเจตนาโดยสำคัญ หากเกิดขึ้นด้วยความประมาทเลินเล่ออย่างร้ายแรง"
  - [x] อัปโหลดรูปภาพไปยัง S3 (/manus-storage/501_41e2750f.jpg)
  - [x] อธิบายมาตรา 156 และ 157 ของประมวลกฎหมายแพ่งและพาณิชย์
  - [x] อธิบายมาตรา 158 และผลของความประมาทเลินเล่ออย่างร้ายแรง
  - [x] รวมคำพิพากษาศาลฎีกาที่ 6436/2567 พร้อมบทเรียนสำคัญ
- [x] Tests ผ่านทั้งหมด 17/17
