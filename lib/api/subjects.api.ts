// ============================================
// SUBJECTS API SERVICE
// ============================================
// Mock API service for subjects
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type { ApiResponse } from './types'
import type { Subject } from '@/types'
import { mockSubjects } from '../mock-data'

class SubjectsApiService {
    /**
     * Get all subjects
     * GET /api/subjects
     */
    async getAllSubjects(): Promise<ApiResponse<Subject[]>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        return {
            success: true,
            data: mockSubjects,
        }
    }

    /**
     * Get subject by ID
     * GET /api/subjects/:id
     */
    async getSubjectById(subjectId: string): Promise<ApiResponse<Subject | null>> {
        await delay(API_CONFIG.MOCK_DELAY / 4)

        const subject = mockSubjects.find(s => s.id === subjectId)

        if (subject) {
            return {
                success: true,
                data: subject,
            }
        }

        return {
            success: false,
            data: null,
            error: {
                code: 'SUBJECT_NOT_FOUND',
                message: 'Không tìm thấy môn học',
            },
        }
    }

    /**
     * Get subjects by category
     * GET /api/subjects?category=:category
     */
    async getSubjectsByCategory(category: string): Promise<ApiResponse<Subject[]>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const subjects = mockSubjects.filter(s => s.category === category)

        return {
            success: true,
            data: subjects,
        }
    }

    /**
     * Get subjects for a grade
     * GET /api/subjects?grade=:grade
     */
    async getSubjectsForGrade(grade: number): Promise<ApiResponse<Subject[]>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const subjects = mockSubjects.filter(s =>
            grade >= s.gradeRange.min && grade <= s.gradeRange.max
        )

        return {
            success: true,
            data: subjects,
        }
    }
}

export const subjectsApi = new SubjectsApiService()
