import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'; 
import './AuthApp.css'
import './Roadmap.css'

// --- MOCK CONFIGURATION ---
const MOCK_FIREBASE_CONFIG = {
    apiKey: "AIzaSyCz1NAJzZxtG65sRUN2NfgIOH3rWL-yZKQ", 
    authDomain: "roadmap-webpage-6b7e4.firebaseapp.com",
    projectId: "roadmap-webpage-6b7e4",
    storageBucket: "roadmap-webpage-6b7e4.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:mockwebid"
};

// --- GLOBAL VARIABLES (Provided by Environment or Mock) ---
const FIREBASE_CONFIG = typeof __firebase_config !== 'undefined' 
    ? JSON.parse(__firebase_config) 
    : MOCK_FIREBASE_CONFIG;
const appId = 'default-app-id'; 

// Initialize Firebase App and Services
const app = initializeApp(FIREBASE_CONFIG);
// Removed: const auth = getAuth(app); 
const db = getFirestore(app); 

// ----------------------------------------------------------------------
// PRE-PROCESSED DATA (Roadmap Content) - RESTRUCTURED WITH REVENUE SLABS
// ----------------------------------------------------------------------
const ROADMAP_CONTENT = {
    Plan: {
        '£500K': [
            { text: '1 Year Forecast', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/32cde99f-c27e-49fe-ab23-62d0d6088259/posts/ca3a8a6d-602b-493f-8d10-5ce5d0cbbc52' },
            { text: 'Asana Task Management', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/f99c3125-00b5-4b18-9a71-548458e85192/posts/0de6d46d-ada9-4223-a51c-5aadda027e77' },
            { text: 'Xero/Quickbooks Setup - Templates & Projects', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15ba264d-5733-4ff4-a8fe-9b5f829eee62/posts/75fc9236-1d3d-4ac3-ade2-2935e07d9abd?is_preview=true' },
        ],
        '£1M': [
            { text: 'Software Tracking', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/b98c95f3-cd8c-4f93-a434-d384adb94a0b/posts/e349e534-721f-4557-a3f7-2efd32340d47?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: '5 Year BHAG (Big Hairy Audacious Goal)', link: '' },
            { text: 'KPIs', link: '' },
            { text: 'Individual Job Profitability', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15ba264d-5733-4ff4-a8fe-9b5f829eee62/posts/b2913425-acc9-471d-bfe6-0d090d91ba33?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£2M': [
            { text: 'Monthly P&Ls', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15ba264d-5733-4ff4-a8fe-9b5f829eee62/posts/38f3149f-ebcc-4778-b4b0-9d2661954b40?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Lead Source Reports', link: '' },
            { text: 'Monthly Income Forecast', link: '' },
        ],
        '£3M': [
            { text: 'Cashflow Forecast', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15ba264d-5733-4ff4-a8fe-9b5f829eee62/posts/2dcb0c45-c848-4585-bb4e-e68d66401b4c?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Pipeline', link: '' },
        ],
        '£5M': []
    },
    Attract: {
        '£500K': [
            { text: 'USP (Unique Selling Proposition)', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15279090-100b-49a4-a877-034d5e322e6c/posts/d9ff6496-a57e-4dba-af66-d7ed89ceb129' },
            { text: 'Brand Guidelines', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15279090-100b-49a4-a877-034d5e322e6c/posts/bade0c1b-9fcf-403b-83de-dcd26e5b0864?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Staff Uniform', link: '' },
            { text: 'Vans Signwritten', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/0926c445-bc1f-476c-8fc7-d27744f81934/posts/5965da31-a6f7-4c0e-a902-27ed3ccfeb7c?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Signboards / Banners', link: '' },
        ],
        '£1M': [
            { text: 'Website on Brand', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15279090-100b-49a4-a877-034d5e322e6c/posts/422280d6-d0cb-484b-8629-6356f9209ea7?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Social Media Profiles Active', link: '' },
            { text: 'Reviews online', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/ad682cdc-40cf-44af-8fae-8898c335ae1d/posts/f74f19d7-bf23-4f7b-9914-4a6c0d7ce95a?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£2M': [
            { text: 'Automated Social Posts', link: '' },
            { text: 'Outbound Marketing', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15279090-100b-49a4-a877-034d5e322e6c/posts/6b0a5030-66df-4265-9d7c-892a46393872' },
            { text: 'LinkedIn Connection & Campaigns', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15279090-100b-49a4-a877-034d5e322e6c/posts/df2a4e5c-9a96-418c-b524-d98f3db6e1ba?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£3M': [
            { text: 'Page 1 Google key search terms', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15279090-100b-49a4-a877-034d5e322e6c/posts/d354f2b0-9a9c-46dd-8400-28a1a10b8d49?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Blogs/Vlogs', link: '' },
            { text: 'Paid Ads', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/15279090-100b-49a4-a877-034d5e322e6c/posts/3d456e77-718f-4e11-b24b-1c034f65e434?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£5M': []
    },
    Convert: {
        '£500K': [
            { text: 'Call Handlers', link: '' },
            { text: 'Telephone Sales Script', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/0926c445-bc1f-476c-8fc7-d27744f81934/posts/02732951-336d-4d3a-97c9-c5cb0261dc2b?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Accurate Pricing', link: '' },
            { text: 'Quality Estimate Presentation', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/ad682cdc-40cf-44af-8fae-8898c335ae1d/posts/2b16bae2-33a6-45b2-959c-eae612d1e70a?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£1M': [
            { text: 'Tracked Follow Up Process', link: '' },
            { text: 'Professional Photos', link: '' },
            { text: 'Case Studies', link: '' },
        ],
        '£2M': [
            { text: 'Client Needs USP Generic Replies', link: '' },
            { text: 'Know, Like, Trust', link: '' },
            { text: 'Awards', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/ad682cdc-40cf-44af-8fae-8898c335ae1d/posts/0feafdc3-131b-407c-b133-6be0a7ab8122?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£3M': [
            { text: 'Quote to Convert Campaign', link: '' },
            { text: 'Long Term Nurture', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/ad682cdc-40cf-44af-8fae-8898c335ae1d/posts/2333756c-a5bb-4d6f-831e-4d3ccf5b1fad?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£5M': []
    },
    Deliver: {
        '£500K': [
            { text: '10min Daily Huddle', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/27922609-ae02-49bc-b392-d127b791d342/posts/326a6e56-1915-443b-823a-beccba72b823?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Gantt Charts', link: '' },
            { text: 'Client Meeting Minutes', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/27922609-ae02-49bc-b392-d127b791d342/posts/367286c3-7917-4fdd-9fff-099b029a1d26?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£1M': [
            { text: 'Pre-Site Set Up', link: '' },
            { text: 'Site Set Up', link: '' },
            { text: 'Health & Safety', link: '' },
            { text: 'Track Workers', link: '' },
            { text: 'Variation Orders', link: '' },
        ],
        '£2M': [
            { text: 'Contractor/Project Manager', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/27922609-ae02-49bc-b392-d127b791d342/posts/da9e9430-1569-49c2-a00a-3c2c45a5c3ad?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Weekly PM Review', link: '' },
        ],
        '£3M': [
            { text: 'Project Sign Off Snagging/Quality Control', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/0926c445-bc1f-476c-8fc7-d27744f81934/posts/7efe78be-bb11-48d5-be0e-ddc4bb6bcc6b?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Documentation Control', link: '' },
        ],
        '£5M': []
    },
    Scale: {
        '£500K': [
            { text: 'Organisation Chart', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/11ea92cb-96db-4a52-8174-f3fe296faf08/posts/e15699d3-d4e8-4c7a-9a29-46ea400ed369?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Supplier Terms Negotiated', link: '' },
            { text: 'Project Contracts', link: '' },
            { text: 'VOIP Phone System', link: '' },
        ],
        '£1M': [
            { text: 'Holiday/Sickness Management', link: '' },
            { text: 'Client Satisfaction Surveys', link: '' },
            { text: 'Solids/Prepayment cards', link: '' },
        ],
        '£2M': [
            { text: 'Company Bible / Training Videos', link: '' },
            { text: 'Partnerships', link: '' },
            { text: 'Job Roles Defined', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/11ea92cb-96db-4a52-8174-f3fe296faf08/posts/aaa5d60d-a5fe-471d-911f-51d0628ab848?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
        ],
        '£3M': [
            { text: 'HR Contracts', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/0926c445-bc1f-476c-8fc7-d27744f81934/posts/ac9d70fe-e62e-42a9-8a6c-d236754edcdd?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Job Adverts', link: 'https://developcoaching.memberships.msgsndr.com/products/b472d77a-977d-493d-9a8a-005794ad92c7/categories/0926c445-bc1f-476c-8fc7-d27744f81934/posts/ac9d70fe-e62e-42a9-8a6c-d236754edcdd?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFubmVsIjoiQVBQIiwic291cmNlIjoiV0VCX1VTRVIiLCJzb3VyY2VJZCI6IlluV0FsbzgyOUhMSkJUQlBtUE9lIiwiYXV0aENsYXNzIjoiVXNlciIsImF1dGhDbGFzc0lkIjoiWW5XQWxvODI5SExKQlRCUG1QT2UiLCJwcmltYXJ5QXV0aENsYXNzSWQiOiJZbldBbG84MjlITEpCVEJQbVBPZSIsInByaW1hcnlVc2VyIjp7fSwiYXBwTWV0YSI6e30sImp0aSI6IjY4ZTVmOWUxZDkwNzQzZGQzNjhiNzA5MCIsImlhdCI6MTc1OTkwMjE3Ny43NTIsImV4cCI6MTc1OTkwNTc3Ny43NTJ9.PkRphaxhvsIw-1Lm02axtEEnX5N09RxlEOBhLV_NFZBbq3IbvEL3LaAagiBhGVrTPpAnwpQYYXS4T1md1K0JP7I2vqPhjUf3ejgfvRA0dbQzR16DlKTtqGfNMSV_Et6Qq58QjPCGyBm54jHTClYVfr2CBhKukKzpHj9ioAhn7coS8kBcr19LR6ckDh3l1o7PyMyAMfzGtzNqh2bOAzCAGuFqjgySVBAXsD_Ezum-eF0JHnl3l3yyIouswOK20dDlD0sW5F6duyDfHrsjzC1nz-Ds2dCnNDs0NhL2P7e3n5w19HgVAWS2GpxaLqYga6d8Un3ANNNfM8L0XoOPcPtlqf6u4XVkLvM1pNHvuvLWSMDDbVI0oeScEFtPbhRP38cgwYaV1OGlgKRyN6YI-TaHNK5nlaAd91_FnfDNVkcV_OnRTZugmFcjKWRta_ZFZMia4EzdXN5OG2pxeSV4q9yZW_yImOripfyvSD6AInTqYscPzxlvn8iwTCLpVvM55cg8IT_PehPAm0xvFo30k93QWdAl48wEU8XgYIAE2Jhpz0o9ViS5rYb94i1_Pl4pL7Xt19erm_Xf3vU0hZCOKzmxcB8pwwtZjO0zUWJZfmnFpfDKL26tknUDz7_GZ1wKrFWrEvxNX0Dfnv4ktwp6ESwRktIqPeQl3nf_0SrmfCI0DoE&location_id=kqwiKif2m2fvapw6tkq0&is_preview=true' },
            { text: 'Pension, Benefits & Rewards', link: '' },
            { text: 'Training Matrix', link: '' },
        ],
        '£5M': [
            { text: 'Reports Dashboard', link: '' },
        ]
    }
};

// Revenue rows constant
const revenueRows = ['£500K', '£1M', '£2M', '£3M', '£5M'];

// Function to get max tasks in a slab across all columns
const getMaxTasksInSlab = (slab) => {
    let max = 0;
    Object.keys(ROADMAP_CONTENT).forEach(col => {
        const tasks = ROADMAP_CONTENT[col][slab];
        if (tasks && tasks.length > max) {
            max = tasks.length;
        }
    });
    return max;
};

// ----------------------------------------------------------------------
// ROADMAP COMPONENT (Protected Content) - UNCHANGED LOGIC
// ----------------------------------------------------------------------

const Roadmap = ({ userId, handleSignOut }) => {
    const [checkedItems, setCheckedItems] = useState({});
    const [isDataLoading, setIsDataLoading] = useState(true);
    
    // Firestore Path for Progress: artifacts/{appId}/users/{userId}/roadmap_progress/checks
    const roadmapProgressRef = doc(db, 'artifacts', appId, 'users', userId, 'roadmap_progress', 'checks');
    
    const columns = Object.keys(ROADMAP_CONTENT);
    
    // --- Data Loading (Firestore) ---
    useEffect(() => {
        if (!userId) return;

        const loadProgress = async () => {
            setIsDataLoading(true);
            try {
                const docSnap = await getDoc(roadmapProgressRef);
                if (docSnap.exists()) {
                    setCheckedItems(docSnap.data().items || {});
                } else {
                    console.log("No existing roadmap progress found, starting fresh.");
                    setCheckedItems({});
                }
            } catch (error) {
                console.error("Error loading progress from Firestore:", error);
            } finally {
                setIsDataLoading(false);
            }
        };
        loadProgress();
    }, [userId]); // Dependency is now just userId 

    // --- Data Saving (Firestore) ---
    const saveProgress = useCallback(async (newCheckedItems) => {
        try {
            await setDoc(roadmapProgressRef, { 
                items: newCheckedItems, 
                updatedAt: new Date().toISOString() 
            });
        } catch (e) {
            console.error("Error saving progress:", e);
        }
    }, [roadmapProgressRef]); 

    // --- Checkbox Handler ---
    const handleCheck = (itemText) => {
        const newCheckedItems = { 
            ...checkedItems, 
            [itemText]: !checkedItems[itemText] 
        };
        
        setCheckedItems(newCheckedItems);
        saveProgress(newCheckedItems);
    };

    // --- Progress Calculation (updated for revenue slabs) ---
    const calculateColumnProgress = (stage) => {
        let totalItems = 0;
        let checkedItemsCount = 0;
        
        revenueRows.forEach(slab => {
            const slabTasks = ROADMAP_CONTENT[stage][slab] || [];
            totalItems += slabTasks.length;
            checkedItemsCount += slabTasks.filter(item => checkedItems[item.text]).length;
        });
        
        const percentage = totalItems === 0 ? 0 : Math.round((checkedItemsCount / totalItems) * 100);
        return { checked: checkedItemsCount, total: totalItems, percentage };
    };

    const overallProgress = useMemo(() => {
        let totalItems = 0;
        let checkedItemsCount = 0;

        Object.keys(ROADMAP_CONTENT).forEach(stage => {
            revenueRows.forEach(slab => {
                const slabTasks = ROADMAP_CONTENT[stage][slab] || [];
                totalItems += slabTasks.length;
                checkedItemsCount += slabTasks.filter(item => checkedItems[item.text]).length;
            });
        });

        const percentage = totalItems === 0 ? 0 : Math.round((checkedItemsCount / totalItems) * 100);
        
        return { checked: checkedItemsCount, total: totalItems, percentage };
    }, [checkedItems]);

    if (isDataLoading) {
        return (
            <div className="auth-wrapper roadmap-loading-overlay">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading Roadmap Progress...</p>
            </div>
        );
    }

    return (
        <div className="roadmap-container">
            {/* ... (Roadmap UI) ... */}
            <div className="roadmap-header">
                <div className="logo-section">
                    <span className="logo-text">DEVELOP</span>
                </div>
                <h1 className="title">The Develop Mastermind® Roadmap</h1>
                
                {/* OVERALL PROGRESS BAR */}
                <div className="overall-progress">
                    <span className="progress-text">Overall Progress: {overallProgress.checked}/{overallProgress.total} ({overallProgress.percentage}%)</span>
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill" 
                            style={{ width: `${overallProgress.percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="roadmap-content">
                {/* Sign Out Button - Now just reloads the parent page, clearing session */}
                <button 
                    onClick={handleSignOut} 
                    className="sign-out-button"
                    style={{ position: 'absolute', top: '30px', right: '30px', zIndex: 10 }}
                >
                    Sign Out
                </button>

                {/* Roadmap Columns with Revenue Slabs */}
                <div className="roadmap-columns">
                    {Object.keys(ROADMAP_CONTENT).map((stage) => {
                        const { checked, total, percentage } = calculateColumnProgress(stage);
                        return (
                            <div key={stage} className={`stage-column stage-${stage.toLowerCase()}`}>
                                
                                {/* Column Header with Progress */}
                                <div className="column-header-progress">
                                    <h2>{stage}</h2>
                                    <div className="progress-info">
                                        <span className="progress-number">{checked}/{total} ({percentage}%)</span>
                                        <div className="progress-bar-small">
                                            <div 
                                                className="progress-bar-fill-small" 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Task List - RENDER ALIGNED SLABS */}
                                <ul className="aligned-task-list">
                                    {revenueRows.map((slab, slabIndex) => {
                                        const slabTasks = ROADMAP_CONTENT[stage][slab] || [];
                                        const maxTasks = getMaxTasksInSlab(slab);
                                        const numTasks = slabTasks.length;
                                        const numPlaceholders = maxTasks - numTasks;
                                        
                                        return (
                                            <React.Fragment key={slab}>
                                                {/* RENDER DIVIDER BEFORE NEW SLAB (except the first one) */}
                                                {slabIndex > 0 && (
                                                    <li className="revenue-divider-container-aligned">
                                                        <hr className="revenue-divider-aligned" />
                                                    </li>
                                                )}

                                                {/* Render Actual Tasks */}
                                                {slabTasks.map((item) => (
                                                    <li key={item.text} className="task-item">
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!checkedItems[item.text]}
                                                                onChange={() => handleCheck(item.text)}
                                                            />
                                                            {item.link ? (
                                                                <a 
                                                                    href={item.link} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="task-text-link"
                                                                >
                                                                    {item.text}
                                                                </a>
                                                            ) : (
                                                                <span className="task-text">{item.text}</span>
                                                            )}
                                                        </label>
                                                    </li>
                                                ))}

                                                {/* Render Placeholders to maintain vertical alignment */}
                                                {Array.from({ length: numPlaceholders }).map((_, i) => (
                                                    <li key={`placeholder-${slab}-${i}`} className="task-placeholder">
                                                        {/* This is an empty list item used for spacing */}
                                                    </li>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Vertical Scale */}
                <div className="roadmap-scale">
                    <br /><br /><br /><br /><br />
                    <div className="scale-label">£500K</div>
                    <br /><br />
                    <div className="scale-label">£1M</div>
                    <br /><br /><br /><br />
                    <div className="scale-label">£2M</div>
                    <div className="scale-label">£3M</div>
                    <div className="scale-label">£5M</div>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// AUTH APP (Entry Component) - MODIFIED FOR IFRAME COMMUNICATION
// ----------------------------------------------------------------------

const AuthApp = () => {
    // We now use this to store the user ID received from the parent
    const [receivedUserId, setReceivedUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- postMessage Listener for User ID ---
    useEffect(() => {
        const handleMessage = (event) => {
            // **SECURITY CHECK**: Replace 'https://your-non-react-domain.com' with the actual parent site URL
            // if (event.origin !== 'https://your-non-react-domain.com') {
            //     console.warn('Received message from unknown origin:', event.origin);
            //     return;
            // }

            const data = event.data;

            if (data.type === 'USER_LOGIN' && data.userId) {
                console.log("User ID received from parent:", data.userId);
                setReceivedUserId(data.userId);
                setLoading(false);
                setError(''); // Clear any previous errors
            } else if (data.type === 'USER_LOGOUT') {
                // Optional: Handle a logout signal from the parent
                setReceivedUserId(null);
                setLoading(false);
            }
        };

        // Attach the event listener
        window.addEventListener('message', handleMessage);

        // Simulate a timeout if no user ID is received within a few seconds
        const timeoutId = setTimeout(() => {
            if (receivedUserId === null) {
                setLoading(false);
                setError("Waiting for user ID from parent site. Ensure you are logged in.");
            }
        }, 5000); 

        // Clean up the listener and timeout
        return () => {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeoutId);
        };
    }, [receivedUserId]); 

    // --- Sign Out Handler (Reloads the Page) ---
    // The parent site is responsible for ending the session/clearing cookies.
    const handleSignOut = useCallback(() => {
        // Send a message to the parent for it to handle the logout (e.g., redirect)
        window.parent.postMessage({ type: 'IFRAME_LOGOUT' }, '*'); 
        // Simple fallback: reload the page (will likely revert to the 'waiting' state)
        window.location.reload();
    }, []);

    // --- Render Logic ---

    if (loading) {
        return (
            <div className="auth-wrapper">
                <div className="loading-spinner"></div>
                <p className="loading-text">Awaiting User Authentication from Parent Site...</p>
            </div>
        );
    }

    // If no ID is received after loading, display an error
    if (receivedUserId === null || error) {
        return (
            <div className="auth-wrapper">
                <div className="auth-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Authentication Required</h2>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="auth-content">
                        <p>This content requires a successful login from the main website.</p>
                        <p>Please ensure you are logged in and try refreshing the page.</p>
                    </div>
                </div>
            </div>
        );
    }
    
    // User ID received, render the content
    return <Roadmap userId={receivedUserId} handleSignOut={handleSignOut} />;
};

// Export the main component
export default AuthApp;