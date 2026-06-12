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
