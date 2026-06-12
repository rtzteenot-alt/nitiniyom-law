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
