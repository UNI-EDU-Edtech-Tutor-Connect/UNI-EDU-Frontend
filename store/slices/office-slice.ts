
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { OfficeAppointment, StaffPerformance, SourceBreakdown, SupportRequest } from "@/lib/api/office.api"

interface OfficeState {
    appointments: OfficeAppointment[]
    staffPerformance: StaffPerformance[]
    sourceBreakdown: SourceBreakdown[]
    supportRequests: SupportRequest[]
    isLoading: boolean
    error: string | null
}

const initialState: OfficeState = {
    appointments: [],
    staffPerformance: [],
    sourceBreakdown: [],
    supportRequests: [],
    isLoading: false,
    error: null,
}

const officeSlice = createSlice({
    name: "office",
    initialState,
    reducers: {
        fetchOfficeDataRequest: (state) => {
            state.isLoading = true
            state.error = null
        },
        fetchOfficeDataSuccess: (
            state,
            action: PayloadAction<{
                appointments: OfficeAppointment[]
                reports: { staff: StaffPerformance[]; sources: SourceBreakdown[] }
                supportRequests: SupportRequest[]
            }>
        ) => {
            state.isLoading = false
            state.appointments = action.payload.appointments
            state.staffPerformance = action.payload.reports.staff
            state.sourceBreakdown = action.payload.reports.sources
            state.supportRequests = action.payload.supportRequests
        },
        fetchOfficeDataFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false
            state.error = action.payload
        },
    },
})

export const { fetchOfficeDataRequest, fetchOfficeDataSuccess, fetchOfficeDataFailure } = officeSlice.actions
export default officeSlice.reducer
