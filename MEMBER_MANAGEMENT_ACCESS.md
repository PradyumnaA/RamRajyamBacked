/**
 * MEMBER MANAGEMENT ACCESS CONTROL
 * 
 * ONLY ADMINS CAN:
 * ✅ Add Members (POST /api/admin/registeruser)
 * ✅ View All Members (GET /api/admin/users)
 * ✅ Update Member Info (PUT /api/admin/users/:id)
 * ✅ Delete Members (DELETE /api/admin/users/:id)
 * ✅ View Member Details (GET /api/admin/users/:id)
 * 
 * REGULAR USERS CAN:
 * ✅ Register themselves (POST /api/users/register) - Public
 * ✅ Update their own profile (PUT /api/users/updateprofile)
 * ✅ View members list (GET /api/users/getallusers)
 * ✅ View member details (GET /api/users/getbyidusers/:id)
 * ❌ Cannot delete themselves or others
 * ❌ Cannot update other users
 * 
 * AUTHENTICATION REQUIRED:
 * - Admin routes use: requireAuth('admin')
 * - All admin operations require valid admin token
 * - User routes use: requireAuth('user')
 */

// ADMIN API ENDPOINTS (PROTECTED):

// 1. ADD NEW MEMBER (Admin only)
// POST /api/admin/registeruser
// Headers: Authorization: Bearer ADMIN_TOKEN
// Body: multipart/form-data with user details

// 2. GET ALL MEMBERS (Admin only)
// GET /api/admin/users?page=1&limit=10
// Headers: Authorization: Bearer ADMIN_TOKEN

// 3. UPDATE MEMBER (Admin only)
// PUT /api/admin/users/USER_ID
// Headers: Authorization: Bearer ADMIN_TOKEN
// Body: multipart/form-data

// 4. DELETE MEMBER (Admin only)
// DELETE /api/admin/users/USER_ID
// Headers: Authorization: Bearer ADMIN_TOKEN

// 5. VIEW MEMBER DETAILS (Admin only)
// GET /api/admin/users/USER_ID
// Headers: Authorization: Bearer ADMIN_TOKEN


// USER API ENDPOINTS (Protected but limited):

// 1. REGISTER NEW ACCOUNT (Public - no auth needed)
// POST /api/users/register
// Body: JSON with name, email, password, phone, gender, etc.

// 2. GET ALL OTHER MEMBERS (User needs token)
// GET /api/users/getallusers
// Headers: Authorization: Bearer USER_TOKEN
// Response: Returns all users EXCEPT current user and EXCEPT admin

// 3. VIEW OWN PROFILE (User needs token)
// GET /api/users/getprofile
// Headers: Authorization: Bearer USER_TOKEN

// 4. UPDATE OWN PROFILE (User needs token)
// PUT /api/users/updateprofile
// Headers: Authorization: Bearer USER_TOKEN
// Body: multipart/form-data
