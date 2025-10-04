class AdminDashboard {
    constructor() {
        this.currentUser = null;
        //to tract login 
        this.loginHistory = JSON.parse(localStorage.getItem('hospital_login_history')) || [];
        // Hardcoded staff data
        this.staffData = [
            { 
                id: 'DOC001', 
                name: 'Dr. Sarah Johnson', 
                role: 'doctor', 
                department: 'Cardiology', 
                email: 's.johnson@hospital.com', 
                phone: '+91-9876543210',
                status: 'active',
                joinDate: '2023-01-15',
                username: 'doc_sara5678',
                password: 'Sarah@123'
            },
            { 
                id: 'DOC002', 
                name: 'Dr. Michael Chen', 
                role: 'doctor', 
                department: 'Neurology', 
                email: 'm.chen@hospital.com', 
                phone: '+91-9876543211',
                status: 'active',
                joinDate: '2023-02-10',
                username: 'doc_mich1234',
                password: 'Michael@123'
            },
            { 
                id: 'NUR001', 
                name: 'Emily Davis', 
                role: 'nurse', 
                department: 'Emergency', 
                email: 'e.davis@hospital.com', 
                phone: '+91-9876543212',
                status: 'active',
                joinDate: '2023-02-20',
                username: 'nur_emil2345',
                password: 'Emily@123'
            },
            { 
                id: 'NUR002', 
                name: 'Robert Wilson', 
                role: 'nurse', 
                department: 'ICU', 
                email: 'r.wilson@hospital.com', 
                phone: '+91-9876543213',
                status: 'on_leave',
                joinDate: '2023-03-15',
                username: 'nur_robe3456',
                password: 'Robert@123'
            },
            { 
                id: 'REC001', 
                name: 'Lisa Brown', 
                role: 'receptionist', 
                department: 'Reception', 
                email: 'l.brown@hospital.com', 
                phone: '+91-9876543214',
                status: 'active',
                joinDate: '2023-03-10',
                username: 'rec_lisa4567',
                password: 'Lisa@123'
            },
            { 
                id: 'LAB001', 
                name: 'Dr. David Miller', 
                role: 'lab_technician', 
                department: 'Pathology', 
                email: 'd.miller@hospital.com', 
                phone: '+91-9876543215',
                status: 'active',
                joinDate: '2023-01-25',
                username: 'lab_davi5678',
                password: 'David@123'
            }
        ];
         this.reportManager = new ReportManager(this);
        
        // Hardcoded departments
        this.departments = [
            'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology',
            'Dermatology', 'Gynecology', 'Emergency', 'Radiology', 'Pathology',
            'ICU', 'General Medicine', 'Surgery'
        ];
        
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadDashboardData();
        this.setupEventListeners();
        this.trackLoginTime();
        this.showLoginHistory();
    }

     // ADD THESE METHODS TO YOUR AdminDashboard CLASS:

    trackLoginTime() {
        if (this.currentUser) {
            const loginRecord = {
                username: this.currentUser.username,
                fullName: this.currentUser.fullName,
                role: this.currentUser.role,
                loginTime: new Date().toLocaleString(),
                sessionId: 'session_' + Math.random().toString(36).substr(2, 9)
            };

            // Save to login history
            this.loginHistory.unshift(loginRecord);
            localStorage.setItem('hospital_login_history', JSON.stringify(this.loginHistory));
            
            console.log('User logged in at:', loginRecord.loginTime);
        }
    }

    showLoginHistory() {
    const historyContainer = document.getElementById('loginHistoryTable');
    if (!historyContainer) return;
    
    let html = '';
    this.loginHistory.forEach(login => {
        html += `
            <tr>
                <td>${login.fullName}</td>
                <td><span class="badge bg-info">${login.role}</span></td>
                <td>${login.loginTime}</td>
                <td><small class="text-muted">${login.sessionId}</small></td>
            </tr>
        `;
    });
    
    historyContainer.innerHTML = html;
}
    checkAuthentication() {
        const session = localStorage.getItem('hospital_session');
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        try {
            this.currentUser = JSON.parse(session);
            if (this.currentUser.role !== 'admin') {
                window.location.href = 'login.html';
                return;
            }
            document.getElementById('adminName').textContent = this.currentUser.fullName;
        } catch (error) {
            console.error('Session error:', error);
            window.location.href = 'login.html';
        }
    }

    setupEventListeners() {
        document.getElementById('hospitalSettings').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveHospitalSettings();
        });
    }

    loadDashboardData() {
        this.loadStats();
        this.loadRecentActivity();
        this.loadStaffTable();
        this.loadPatientsData();
    }

    loadStats() {
        // Hardcoded stats
        document.getElementById('totalPatients').textContent = '1,248';
        document.getElementById('todayAppointments').textContent = '47';
        document.getElementById('totalStaff').textContent = this.staffData.length;
        document.getElementById('revenue').textContent = '₹2,84,500';
    }

    loadRecentActivity() {
        // Hardcoded activities
        const activities = [
            { action: 'New patient registration', user: 'John Doe', time: '2 minutes ago', type: 'success' },
            { action: 'Prescription updated', user: 'Sarah Smith', time: '15 minutes ago', type: 'info' },
            { action: 'New appointment scheduled', user: 'Dr. Johnson', time: '1 hour ago', type: 'primary' },
            { action: 'Lab test completed', user: 'Michael Chen', time: '2 hours ago', type: 'warning' },
            { action: 'Emergency admission', user: 'Robert Brown', time: '3 hours ago', type: 'danger' }
        ];

        const activityContainer = document.getElementById('recentActivity');
        activityContainer.innerHTML = '';

        activities.forEach(activity => {
            const activityItem = `
                <div class="list-group-item">
                    <div class="row align-items-center">
                        <div class="col-auto">
                            <i class="fas fa-circle text-${activity.type}"></i>
                        </div>
                        <div class="col">
                            <strong>${activity.action}</strong> - ${activity.user}
                        </div>
                        <div class="col-auto text-muted">
                            <small>${activity.time}</small>
                        </div>
                    </div>
                </div>
            `;
            activityContainer.innerHTML += activityItem;
        });
    }

    loadStaffTable() {
        const staffTable = document.querySelector('#staffTable tbody');
        staffTable.innerHTML = '';

        this.staffData.forEach(staff => {
            const statusBadge = staff.status === 'active' ? 
                '<span class="badge badge-success">Active</span>' : 
                staff.status === 'on_leave' ? 
                '<span class="badge badge-warning">On Leave</span>' :
                '<span class="badge badge-secondary">Inactive</span>';

            const row = `
                <tr>
                    <td>${staff.id}</td>
                    <td>${staff.name}</td>
                    <td>${this.formatRole(staff.role)}</td>
                    <td>${staff.department}</td>
                    <td>${staff.email}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="adminDashboard.editStaff('${staff.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="adminDashboard.deleteStaff('${staff.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            staffTable.innerHTML += row;
        });
    }

    loadPatientsData() {
        // Hardcoded patient data
        const patients = [
            { id: 'P1001', name: 'John Smith', age: 45, gender: 'Male', phone: '+91-9876543210', lastVisit: '2024-01-15', status: 'Active' },
            { id: 'P1002', name: 'Maria Garcia', age: 32, gender: 'Female', phone: '+91-9876543211', lastVisit: '2024-01-14', status: 'Active' },
            { id: 'P1003', name: 'Robert Brown', age: 68, gender: 'Male', phone: '+91-9876543212', lastVisit: '2024-01-13', status: 'Discharged' },
            { id: 'P1004', name: 'Sarah Wilson', age: 29, gender: 'Female', phone: '+91-9876543213', lastVisit: '2024-01-12', status: 'Active' },
            { id: 'P1005', name: 'David Miller', age: 55, gender: 'Male', phone: '+91-9876543214', lastVisit: '2024-01-11', status: 'Active' },
            { id: 'P1006', name: 'Lisa Taylor', age: 38, gender: 'Female', phone: '+91-9876543215', lastVisit: '2024-01-10', status: 'Discharged' }
        ];

        const patientsTable = document.querySelector('#patientsTable tbody');
        patientsTable.innerHTML = '';

        patients.forEach(patient => {
            const statusBadge = patient.status === 'Active' ? 
                '<span class="badge badge-success">Active</span>' : 
                '<span class="badge badge-secondary">Discharged</span>';

            const row = `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.phone}</td>
                    <td>${patient.lastVisit}</td>
                    <td>${statusBadge}</td>
                </tr>
            `;
            patientsTable.innerHTML += row;
        });
    }

    formatRole(role) {
        const roleMap = {
            'doctor': 'Doctor',
            'nurse': 'Nurse',
            'receptionist': 'Receptionist',
            'lab_technician': 'Lab Technician',
            'admin': 'Admin'
        };
        return roleMap[role] || role;
    }

    generateUsername(fullName, role) {
        const namePart = fullName.toLowerCase().replace(/\s+/g, '');
        const rolePrefix = this.getRolePrefix(role);
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        return `${rolePrefix}${namePart.substring(0, 4)}${randomNum}`;
    }

    getRolePrefix(role) {
        const rolePrefixes = {
            'doctor': 'doc_',
            'nurse': 'nur_',
            'receptionist': 'rec_',
            'lab_technician': 'lab_',
            'admin': 'adm_'
        };
        return rolePrefixes[role] || 'usr_';
    }

    generatePassword() {
        const length = 8;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    generateStaffId(role) {
        const roleCodes = {
            'doctor': 'DOC',
            'nurse': 'NUR',
            'receptionist': 'REC',
            'lab_technician': 'LAB',
            'admin': 'ADM'
        };
        
        const prefix = roleCodes[role] || 'EMP';
        const existingIds = this.staffData.filter(staff => staff.id.startsWith(prefix));
        const nextNumber = existingIds.length + 1;
        
        return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    }

    addStaff() {
        const fullName = document.getElementById('addFullName').value;
        const role = document.getElementById('addRole').value;
        const department = document.getElementById('addDepartment').value;
        const email = document.getElementById('addEmail').value;
        const phone = document.getElementById('addPhone').value;

        // Validate required fields
        if (!fullName || !role || !email || !phone) {
            this.showNotification('Please fill all required fields!', 'danger');
            return;
        }

        // Validate department for doctors
        if (role === 'doctor' && !department) {
            this.showNotification('Department is required for doctors!', 'danger');
            return;
        }

        // Generate staff credentials
        const username = this.generateUsername(fullName, role);
        const password = this.generatePassword();
        const staffId = this.generateStaffId(role);

        const staffData = {
            id: staffId,
            name: fullName,
            role: role,
            department: role === 'doctor' ? department : this.getDefaultDepartment(role),
            email: email,
            phone: phone,
            username: username,
            password: password,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0]
        };

        // Add to staff data array
        this.staffData.push(staffData);

        // Show credentials to admin
        this.showStaffCredentials(staffData);

        // Reset form and close modal
        document.getElementById('addStaffForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStaffModal'));
        modal.hide();
        
        // Reload staff table
        this.loadStaffTable();
    }

    getDefaultDepartment(role) {
        const defaultDepartments = {
            'nurse': 'Nursing',
            'receptionist': 'Reception',
            'lab_technician': 'Laboratory',
            'admin': 'Administration'
        };
        return defaultDepartments[role] || 'General';
    }

    showStaffCredentials(staffData) {
        const credentialsHTML = `
            <div class="alert alert-info">
                <h6>Staff Account Created Successfully!</h6>
                <div class="mt-2">
                    <p><strong>Staff ID:</strong> ${staffData.id}</p>
                    <p><strong>Username:</strong> ${staffData.username}</p>
                    <p><strong>Password:</strong> ${staffData.password}</p>
                    <p class="text-danger small">Please note these credentials and share with the staff member securely.</p>
                </div>
            </div>
        `;
        
        this.showNotification(credentialsHTML, 'info', 10000);
    }

    editStaff(staffId) {
        const staff = this.staffData.find(s => s.id === staffId);
        if (!staff) {
            this.showNotification('Staff member not found!', 'danger');
            return;
        }

        // Populate edit form
        document.getElementById('editStaffId').value = staff.id;
        document.getElementById('editFullName').value = staff.name;
        document.getElementById('editRole').value = staff.role;
        document.getElementById('editDepartment').value = staff.department;
        document.getElementById('editEmail').value = staff.email;
        document.getElementById('editPhone').value = staff.phone;
        document.getElementById('editStatus').value = staff.status;

        // Show/hide department field based on role
        toggleDepartmentField('edit');

        const modal = new bootstrap.Modal(document.getElementById('editStaffModal'));
        modal.show();
    }

    updateStaff() {
        const staffId = document.getElementById('editStaffId').value;
        const staffIndex = this.staffData.findIndex(s => s.id === staffId);
        
        if (staffIndex === -1) {
            this.showNotification('Staff member not found!', 'danger');
            return;
        }

        // Update staff data
        this.staffData[staffIndex] = {
            ...this.staffData[staffIndex],
            name: document.getElementById('editFullName').value,
            role: document.getElementById('editRole').value,
            department: document.getElementById('editRole').value === 'doctor' ? 
                         document.getElementById('editDepartment').value : 
                         this.getDefaultDepartment(document.getElementById('editRole').value),
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            status: document.getElementById('editStatus').value
        };

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editStaffModal'));
        modal.hide();

        // Show success message
        this.showNotification('Staff member updated successfully!', 'success');

        // Reload staff table
        this.loadStaffTable();
    }

    deleteStaff(staffId) {
        const staff = this.staffData.find(s => s.id === staffId);
        if (!staff) {
            this.showNotification('Staff member not found!', 'danger');
            return;
        }

        // Populate delete confirmation modal
        document.getElementById('deleteStaffName').textContent = `${staff.name} (${staff.id})`;
        document.getElementById('deleteStaffId').value = staffId;

        const modal = new bootstrap.Modal(document.getElementById('deleteStaffModal'));
        modal.show();
    }

    confirmDeleteStaff() {
        const staffId = document.getElementById('deleteStaffId').value;
        
        // Remove staff from data array
        this.staffData = this.staffData.filter(s => s.id !== staffId);

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteStaffModal'));
        modal.hide();

        // Show success message
        this.showNotification('Staff member deleted successfully!', 'success');

        // Reload staff table
        this.loadStaffTable();
    }

    saveHospitalSettings() {
        const hospitalName = document.getElementById('hospitalName').value;
        const hospitalEmail = document.getElementById('hospitalEmail').value;
        const hospitalPhone = document.getElementById('hospitalPhone').value;

        // Hardcoded settings save
        this.showNotification('Hospital settings saved successfully!', 'success');
    }

    showNotification(message, type, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 400px; max-width: 500px;';
        
        if (typeof message === 'string' && message.includes('<')) {
            notification.innerHTML = message;
        } else {
            notification.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
}

// Global functions 
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav link
    event.target.classList.add('active');
    
    //  ADD THIS: Initialize reports when reports section is shown
    if (sectionId === 'reports') {
        setTimeout(() => {
            adminDashboard.reportManager.initReports();
        }, 100);
    }
}

function showAddStaffModal() {
    // Reset form and show department field based on default selection
    document.getElementById('addStaffForm').reset();
    toggleDepartmentField('add');
    
    const modal = new bootstrap.Modal(document.getElementById('addStaffModal'));
    modal.show();
}

function toggleDepartmentField(formType = 'add') {
    const roleField = document.getElementById(`${formType}Role`);
    const departmentField = document.getElementById(`${formType}DepartmentField`);
    const departmentSelect = document.getElementById(`${formType}Department`);
    
    if (roleField.value === 'doctor') {
        departmentField.style.display = 'block';
        departmentSelect.required = true;
    } else {
        departmentField.style.display = 'none';
        departmentSelect.required = false;
        departmentSelect.value = '';
    }
}

function generateReport(type) {
    const reports = {
        'patient': 'Patient Report',
        'revenue': 'Revenue Report',
        'staff': 'Staff Performance Report'
    };
    
    adminDashboard.showNotification(`${reports[type]} generated successfully!`, 'info');
}

function backupData() {
    adminDashboard.showNotification('Data backup completed successfully!', 'warning');
}

// FIND THIS EXISTING logout FUNCTION AND REPLACE IT:

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Record logout time
        if (adminDashboard && adminDashboard.currentUser) {
            const logoutRecord = {
                username: adminDashboard.currentUser.username,
                logoutTime: new Date().toLocaleString()
            };

            // Save logout record
            let logoutHistory = JSON.parse(localStorage.getItem('hospital_logout_history')) || [];
            logoutHistory.unshift(logoutRecord);
            localStorage.setItem('hospital_logout_history', JSON.stringify(logoutHistory));
        }

        localStorage.removeItem('hospital_session');
        window.location.href = 'login.html';
    }
}
// Initialize admin dashboard when DOM is loaded
let adminDashboard;
document.addEventListener('DOMContentLoaded', () => {
    adminDashboard = new AdminDashboard();
});

// Add event listeners for role changes
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for add staff role change
    const addRole = document.getElementById('addRole');
    if (addRole) {
        addRole.addEventListener('change', function() {
            toggleDepartmentField('add');
        });
    }
    
    // Add event listener for edit staff role change
    const editRole = document.getElementById('editRole');
    if (editRole) {
        editRole.addEventListener('change', function() {
            toggleDepartmentField('edit');
        });
    }
});

// Add this complete ReportManager class after AdminDashboard class
class ReportManager {
    constructor(adminDashboard) {
        this.adminDashboard = adminDashboard;
        this.currentChart = null;
        this.currentReportType = 'patient';
        this.currentChartType = 'bar';
        
        this.chartColors = {
            primary: '#808000',
            secondary: '#9a9a00',
            light: '#b8b894',
            dark: '#666600',
            success: '#28a745',
            info: '#17a2b8',
            warning: '#ffc107',
            danger: '#dc3545',
            purple: '#6f42c1'
        };
    }

    initReports() {
        this.loadReportSummary();
        this.generatePatientReport();
        this.setupDateFilters();
    }

    setupDateFilters() {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        document.getElementById('startDate').value = startOfMonth.toISOString().split('T')[0];
        document.getElementById('endDate').value = today.toISOString().split('T')[0];
    }
    // Add this method to ReportManager class
generateLoginReport() {
    const loginHistory = JSON.parse(localStorage.getItem('hospital_login_history')) || [];
    
    const tableHead = `
        <tr>
            <th>User</th>
            <th>Role</th>
            <th>Login Time</th>
            <th>Session ID</th>
        </tr>
    `;

    let tableBody = '';
    loginHistory.forEach(login => {
        tableBody += `
            <tr>
                <td>${login.fullName}</td>
                <td><span class="badge bg-info">${login.role}</span></td>
                <td>${login.loginTime}</td>
                <td><small class="text-muted">${login.sessionId}</small></td>
            </tr>
        `;
    });

    document.getElementById('reportTableHead').innerHTML = tableHead;
    document.getElementById('reportTableBody').innerHTML = tableBody;
    document.getElementById('tableTitle').textContent = 'Login History Report';
    document.getElementById('totalRecords').textContent = `${loginHistory.length} login records`;
}
    loadReportSummary() {
        const summaryData = {
            totalPatients: '1,248',
            totalRevenue: 2854300,
            totalAppointments: 289,
            staffCount: this.adminDashboard.staffData.length,
            avgRating: 4.7,
            occupancyRate: 78
        };

        const summaryHTML = `
            <div class="col-xl-2 col-md-4 col-6 mb-3">
                <div class="card summary-card">
                    <div class="card-body text-center">
                        <div class="summary-number text-olive">${summaryData.totalPatients}</div>
                        <div class="summary-label">Total Patients</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-2 col-md-4 col-6 mb-3">
                <div class="card summary-card">
                    <div class="card-body text-center">
                        <div class="summary-number text-olive">₹${this.formatNumber(summaryData.totalRevenue)}</div>
                        <div class="summary-label">Total Revenue</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-2 col-md-4 col-6 mb-3">
                <div class="card summary-card">
                    <div class="card-body text-center">
                        <div class="summary-number text-olive">${summaryData.totalAppointments}</div>
                        <div class="summary-label">Appointments</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-2 col-md-4 col-6 mb-3">
                <div class="card summary-card">
                    <div class="card-body text-center">
                        <div class="summary-number text-olive">${summaryData.staffCount}</div>
                        <div class="summary-label">Staff Members</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-2 col-md-4 col-6 mb-3">
                <div class="card summary-card">
                    <div class="card-body text-center">
                        <div class="summary-number text-olive">${summaryData.avgRating}/5</div>
                        <div class="summary-label">Avg Rating</div>
                    </div>
                </div>
            </div>
            <div class="col-xl-2 col-md-4 col-6 mb-3">
                <div class="card summary-card">
                    <div class="card-body text-center">
                        <div class="summary-number text-olive">${summaryData.occupancyRate}%</div>
                        <div class="summary-label">Occupancy Rate</div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('reportSummary').innerHTML = summaryHTML;
    }

    generatePatientReport() {
        this.currentReportType = 'patient';
        const patientData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Patients',
                data: [45, 52, 48, 65, 72, 78],
                backgroundColor: this.chartColors.primary,
                borderColor: this.chartColors.dark,
                borderWidth: 2
            }]
        };
        this.renderChart(patientData, 'Patient Statistics');
        this.renderPatientTable();
    }

    generateRevenueReport() {
        this.currentReportType = 'revenue';
        const revenueData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue (₹)',
                data: [125000, 132000, 141000, 148000, 156000, 162000],
                backgroundColor: this.chartColors.success,
                borderColor: this.chartColors.dark,
                borderWidth: 2
            }]
        };
        this.renderChart(revenueData, 'Revenue Report');
        this.renderRevenueTable();
    }

    // ADD THESE NEW METHODS FOR REPORT MANAGEMENT
    changeReportType(type) {
        this.currentReportType = type;
        
        switch(type) {
            case 'patient':
                this.generatePatientReport();
                break;
            case 'revenue':
                this.generateRevenueReport();
                break;
            case 'staff':
                this.generateStaffReport();
                break;
            case 'appointment':
                this.generateAppointmentReport();
                break;
            case 'department':
                this.generateDepartmentReport();
                break;
        }
    }

    changeChartType(type) {
        this.currentChartType = type;
        this.refreshCurrentReport();
    }

    refreshCurrentReport() {
        this.changeReportType(this.currentReportType);
    }

    applyDateFilter() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (!startDate || !endDate) {
            this.showNotification('Please select both start and end dates!', 'warning');
            return;
        }
        
        if (new Date(startDate) > new Date(endDate)) {
            this.showNotification('Start date cannot be after end date!', 'danger');
            return;
        }
        
        this.showNotification(`Applying filter: ${startDate} to ${endDate}`, 'info');
        this.refreshCurrentReport();
    }

    refreshData() {
        this.showNotification('Refreshing report data...', 'info');
        
        // Simulate API call delay
        setTimeout(() => {
            this.refreshCurrentReport();
            document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
            this.showNotification('Data refreshed successfully!', 'success');
        }, 1000);
    }

    // ADD THESE EXPORT METHODS
    exportToPDF() {
        this.showNotification('Preparing PDF export...', 'info');
        
        // Simulate PDF generation
        setTimeout(() => {
            const reportType = document.getElementById('reportType').value;
            const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;
            
            this.showNotification(`PDF "${fileName}" generated successfully!`, 'success');
            
            // Simulate download
            this.simulateDownload(fileName, 'application/pdf');
        }, 2000);
    }

    exportToExcel() {
        this.showNotification('Preparing Excel export...', 'info');
        
        setTimeout(() => {
            const reportType = document.getElementById('reportType').value;
            const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            this.showNotification(`Excel file "${fileName}" generated successfully!`, 'success');
            
            // Simulate download
            this.simulateDownload(fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        }, 1500);
    }

    exportChart() {
        this.showNotification('Exporting chart image...', 'info');
        
        setTimeout(() => {
            const canvas = document.getElementById('reportChart');
            const chartURL = canvas.toDataURL('image/png');
            const fileName = `chart_${new Date().toISOString().split('T')[0]}.png`;
            
            // Create temporary link for download
            const link = document.createElement('a');
            link.download = fileName;
            link.href = chartURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('Chart exported successfully!', 'success');
        }, 1000);
    }

    // Helper method to simulate file download
    simulateDownload(fileName, mimeType) {
        // Create a blob with sample data
        const sampleData = `This is a sample ${mimeType.includes('pdf') ? 'PDF' : 'Excel'} file for ${fileName}`;
        const blob = new Blob([sampleData], { type: mimeType });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Additional report generation methods
    generateStaffReport() {
        const staffData = {
            labels: ['Doctors', 'Nurses', 'Receptionists', 'Lab Technicians', 'Admin'],
            datasets: [{
                label: 'Staff Count',
                data: [24, 35, 8, 12, 7],
                backgroundColor: [
                    this.chartColors.primary,
                    this.chartColors.info,
                    this.chartColors.warning,
                    this.chartColors.success,
                    this.chartColors.danger
                ]
            }]
        };
        this.renderChart(staffData, 'Staff Distribution', 'doughnut');
        this.renderStaffTable();
    }

    generateAppointmentReport() {
        const appointmentData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Appointments',
                data: [45, 52, 48, 65, 72, 35],
                backgroundColor: this.chartColors.info,
                borderColor: this.chartColors.dark,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };
        this.renderChart(appointmentData, 'Weekly Appointments', 'line');
        this.renderAppointmentTable();
    }

    generateDepartmentReport() {
        const departmentData = {
            labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency'],
            datasets: [{
                label: 'Patients Treated',
                data: [125, 89, 156, 203, 178],
                backgroundColor: this.chartColors.purple,
                borderColor: this.chartColors.dark,
                borderWidth: 2
            }]
        };
        this.renderChart(departmentData, 'Department Performance', 'bar');
        this.renderDepartmentTable();
    }

    renderChart(data, title, type = null) {
        const ctx = document.getElementById('reportChart').getContext('2d');
        if (this.currentChart) {
            this.currentChart.destroy();
        }
        const chartType = type || this.currentChartType;
        this.currentChart = new Chart(ctx, {
            type: chartType,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: title }
                }
            }
        });
        document.getElementById('chartTitle').textContent = title;
    }

    renderPatientTable() {
        const patients = [
            { id: 'P1001', name: 'John Smith', age: 45, gender: 'Male', visits: 5, lastVisit: '2024-01-15', status: 'Active' },
            { id: 'P1002', name: 'Maria Garcia', age: 32, gender: 'Female', visits: 3, lastVisit: '2024-01-14', status: 'Active' },
            { id: 'P1003', name: 'Robert Brown', age: 68, gender: 'Male', visits: 8, lastVisit: '2024-01-13', status: 'Discharged' },
            { id: 'P1004', name: 'Sarah Wilson', age: 29, gender: 'Female', visits: 2, lastVisit: '2024-01-12', status: 'Active' }
        ];

        const tableHead = `
            <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Total Visits</th>
                <th>Last Visit</th>
                <th>Status</th>
            </tr>
        `;

        let tableBody = '';
        patients.forEach(patient => {
            tableBody += `
                <tr>
                    <td>${patient.id}</td>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.visits}</td>
                    <td>${patient.lastVisit}</td>
                    <td><span class="badge bg-success">${patient.status}</span></td>
                </tr>
            `;
        });

        document.getElementById('reportTableHead').innerHTML = tableHead;
        document.getElementById('reportTableBody').innerHTML = tableBody;
        document.getElementById('tableTitle').textContent = 'Patient Statistics';
        document.getElementById('totalRecords').textContent = `${patients.length} patients`;
    }

    renderRevenueTable() {
        const revenueData = [
            { month: 'January', revenue: 125000, expenses: 85000, profit: 40000 },
            { month: 'February', revenue: 132000, expenses: 88000, profit: 44000 },
            { month: 'March', revenue: 141000, expenses: 92000, profit: 49000 },
            { month: 'April', revenue: 148000, expenses: 95000, profit: 53000 },
            { month: 'May', revenue: 156000, expenses: 98000, profit: 58000 },
            { month: 'June', revenue: 162000, expenses: 101000, profit: 61000 }
        ];

        const tableHead = `
            <tr>
                <th>Month</th>
                <th>Revenue (₹)</th>
                <th>Expenses (₹)</th>
                <th>Profit (₹)</th>
            </tr>
        `;

        let tableBody = '';
        revenueData.forEach(data => {
            tableBody += `
                <tr>
                    <td>${data.month}</td>
                    <td>₹${this.formatNumber(data.revenue)}</td>
                    <td>₹${this.formatNumber(data.expenses)}</td>
                    <td>₹${this.formatNumber(data.profit)}</td>
                </tr>
            `;
        });

        document.getElementById('reportTableHead').innerHTML = tableHead;
        document.getElementById('reportTableBody').innerHTML = tableBody;
        document.getElementById('tableTitle').textContent = 'Revenue Report';
        document.getElementById('totalRecords').textContent = `${revenueData.length} months`;
    }

    renderStaffTable() {
        const staffData = [
            { department: 'Doctors', count: 24, avgPatients: 18, rating: 4.8 },
            { department: 'Nurses', count: 35, avgPatients: 12, rating: 4.6 },
            { department: 'Receptionists', count: 8, avgPatients: 25, rating: 4.4 },
            { department: 'Lab Technicians', count: 12, avgPatients: 15, rating: 4.7 },
            { department: 'Admin', count: 7, avgPatients: 0, rating: 4.5 }
        ];

        const tableHead = `
            <tr>
                <th>Department</th>
                <th>Staff Count</th>
                <th>Avg Patients/Day</th>
                <th>Rating</th>
            </tr>
        `;

        let tableBody = '';
        staffData.forEach(data => {
            tableBody += `
                <tr>
                    <td>${data.department}</td>
                    <td>${data.count}</td>
                    <td>${data.avgPatients}</td>
                    <td>
                        <span class="badge bg-success">${data.rating}/5</span>
                    </td>
                </tr>
            `;
        });

        document.getElementById('reportTableHead').innerHTML = tableHead;
        document.getElementById('reportTableBody').innerHTML = tableBody;
        document.getElementById('tableTitle').textContent = 'Staff Performance';
        document.getElementById('totalRecords').textContent = `${staffData.reduce((sum, dept) => sum + dept.count, 0)} staff members`;
    }

    renderAppointmentTable() {
        const appointmentData = [
            { day: 'Monday', appointments: 45, completed: 42, cancelled: 3 },
            { day: 'Tuesday', appointments: 52, completed: 48, cancelled: 4 },
            { day: 'Wednesday', appointments: 48, completed: 45, cancelled: 3 },
            { day: 'Thursday', appointments: 65, completed: 61, cancelled: 4 },
            { day: 'Friday', appointments: 72, completed: 68, cancelled: 4 },
            { day: 'Saturday', appointments: 35, completed: 32, cancelled: 3 }
        ];

        const tableHead = `
            <tr>
                <th>Day</th>
                <th>Total Appointments</th>
                <th>Completed</th>
                <th>Cancelled</th>
                <th>Success Rate</th>
            </tr>
        `;

        let tableBody = '';
        appointmentData.forEach(data => {
            const successRate = ((data.completed / data.appointments) * 100).toFixed(1);
            tableBody += `
                <tr>
                    <td>${data.day}</td>
                    <td>${data.appointments}</td>
                    <td>${data.completed}</td>
                    <td>${data.cancelled}</td>
                    <td>
                        <span class="badge bg-success">${successRate}%</span>
                    </td>
                </tr>
            `;
        });

        document.getElementById('reportTableHead').innerHTML = tableHead;
        document.getElementById('reportTableBody').innerHTML = tableBody;
        document.getElementById('tableTitle').textContent = 'Appointment Analysis';
        document.getElementById('totalRecords').textContent = `${appointmentData.reduce((sum, day) => sum + day.appointments, 0)} appointments`;
    }

    renderDepartmentTable() {
        const departmentData = [
            { department: 'Cardiology', patients: 125, revenue: 450000, rating: 4.8 },
            { department: 'Neurology', patients: 89, revenue: 380000, rating: 4.7 },
            { department: 'Orthopedics', patients: 156, revenue: 520000, rating: 4.6 },
            { department: 'Pediatrics', patients: 203, revenue: 310000, rating: 4.9 },
            { department: 'Emergency', patients: 178, revenue: 480000, rating: 4.5 }
        ];

        const tableHead = `
            <tr>
                <th>Department</th>
                <th>Patients Treated</th>
                <th>Revenue (₹)</th>
                <th>Rating</th>
            </tr>
        `;

        let tableBody = '';
        departmentData.forEach(data => {
            tableBody += `
                <tr>
                    <td>${data.department}</td>
                    <td>${data.patients}</td>
                    <td>₹${this.formatNumber(data.revenue)}</td>
                    <td>
                        <span class="badge bg-success">${data.rating}/5</span>
                    </td>
                </tr>
            `;
        });

        document.getElementById('reportTableHead').innerHTML = tableHead;
        document.getElementById('reportTableBody').innerHTML = tableBody;
        document.getElementById('tableTitle').textContent = 'Department-wise Report';
        document.getElementById('totalRecords').textContent = `${departmentData.length} departments`;
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    showNotification(message, type, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
}