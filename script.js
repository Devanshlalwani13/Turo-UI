document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const state = {
        currentPage: 'login-page',
        currentCase: null, // Will hold { caseId, patientName, organ }
    };

    // --- DOM Element Cache ---
    const dom = {
        pages: document.querySelectorAll('.page-container'),
        mainApp: document.getElementById('main-app-container'),
        navLinks: document.querySelectorAll('.nav-link'),
        modals: document.querySelectorAll('.modal-overlay'),
        userDropdown: document.getElementById('user-dropdown'),
        reportingDrawer: document.getElementById('reporting-drawer'),
        caseDetailHeader: document.getElementById('case-detail-header'),
        slideGridContainer: document.getElementById('slide-grid-container'),
        caseDetailTabs: document.querySelectorAll('.tab-item'),
        caseDetailPanes: document.querySelectorAll('.tab-pane'),
    };

    // --- Core Functions ---
    const navigateTo = (pageId) => {
        dom.pages.forEach(p => p.classList.add('hidden'));
        document.getElementById(pageId)?.classList.remove('hidden');
        
        dom.navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-link[data-page="${pageId}"]`)?.classList.add('active');
        
        state.currentPage = pageId;
    };

    const openModal = (modalId) => document.getElementById(modalId)?.classList.remove('hidden');
    const closeModal = (modalId) => document.getElementById(modalId)?.classList.add('hidden');
    const closeAllModals = () => dom.modals.forEach(m => m.classList.add('hidden'));

    // --- Event Handler ---
    document.body.addEventListener('click', (e) => {
        const actionTarget = e.target.closest('[data-action]');
        if (!actionTarget) return;

        const { action } = actionTarget.dataset;
        const caseRow = actionTarget.closest('tr');

        if (caseRow) {
            state.currentCase = { ...caseRow.dataset };
        }

        // --- Switch Board for All UI Actions ---
        switch (action) {
            // Navigation & Auth
            case 'login':
                dom.mainApp.classList.remove('hidden');
                navigateTo('cases-list-page');
                break;
            case 'logout':
                dom.mainApp.classList.add('hidden');
                document.getElementById('login-page').classList.remove('hidden');
                break;
            case 'nav-ai-microscopy': navigateTo('ai-microscopy-page'); break;
            case 'nav-radiology': navigateTo('radiology-page'); break;
            
            // User Menu & Notifications
            case 'toggle-user-menu': dom.userDropdown.classList.toggle('hidden'); break;
            case 'show-notifications': alert("Showing Notifications..."); break;
            
            // Case List Actions
            case 'view-case-detail':
                navigateTo('case-detail-page');
                dom.caseDetailHeader.textContent = `Case: ${state.currentCase.caseId} - ${state.currentCase.patientName}`;
                break;
            case 'view-slides':
                openModal('slide-detail-modal');
                dom.slideGridContainer.innerHTML = `<h4>Slides for ${state.currentCase.patientName} will load here.</h4>`;
                break;
            case 'copy-move-case': alert(`Copy/Move Case: ${state.currentCase.caseId}`); break;
            case 'share-case': alert(`Share Case: ${state.currentCase.caseId}`); break;
            case 'create-qr-code': alert(`Generating QR Code for: ${state.currentCase.caseId}`); break;
            case 'delete-case':
                if (confirm(`Are you sure you want to delete Case ${state.currentCase.caseId}?`)) {
                    alert(`Deleting Case: ${state.currentCase.caseId}`);
                    caseRow.remove();
                }
                break;

            // WSI Viewer & Reporting
            case 'toggle-reporting-drawer':
                alert(`Opening reporting drawer.\nAuto-loading template for: ${state.currentCase?.organ || 'Unknown Organ'}`);
                dom.reportingDrawer.classList.toggle('active');
                break;
            
            // Annotation Tools
            case 'tool-polygon':
            case 'tool-rectangle':
            case 'tool-freehand':
            case 'tool-point':
            case 'tool-brush':
                alert(`Selected annotation tool: ${action.split('-')[1].charAt(0).toUpperCase() + action.split('-')[1].slice(1)}`);
                break;
                
            // Radiology Actions
            case 'import-pacs': alert("Opening PACS import interface..."); break;
            case 'upload-dicom': alert("Opening DICOM folder upload dialog..."); break;

            // Modal & Wizard Actions
            case 'open-new-case-wizard': openModal('create-case-wizard'); break;
            case 'close-modal': closeAllModals(); break;
            case 'fetch-lis':
                alert("Simulating LIS Fetch from barcode...");
                document.getElementById('case-patient-name').value = 'LIS Patient';
                document.getElementById('case-patient-age').value = '55';
                document.getElementById('case-organ').value = 'Skin';
                document.getElementById('case-history').value = 'Fetched from LIS: Lesion on left arm.';
                break;
            case 'create-case':
                alert("New case created (simulation).");
                closeAllModals();
                break;
        }
    });

    // --- Specific Listeners for Non-Delegated Events ---
    dom.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    dom.caseDetailTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            dom.caseDetailTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            dom.caseDetailPanes.forEach(p => p.classList.add('hidden'));
            document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
        });
    });

    // --- Initial Setup ---
    navigateTo('login-page');
    dom.mainApp.classList.add('hidden');
});