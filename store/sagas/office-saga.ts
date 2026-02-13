
import { call, put, takeLatest, all } from "redux-saga/effects"
import { officeService } from "@/lib/api/office.api"
import {
    fetchOfficeDataRequest,
    fetchOfficeDataSuccess,
    fetchOfficeDataFailure,
} from "../slices/office-slice"

function* fetchOfficeData() {
    try {
        const [appointments, reports, supportRequests] = yield all([
            call(officeService.getAppointments),
            call(officeService.getReports),
            call(officeService.getSupportRequests),
        ])

        yield put(
            fetchOfficeDataSuccess({
                appointments,
                reports,
                supportRequests,
            })
        )
    } catch (error: any) {
        yield put(fetchOfficeDataFailure(error.message || "Failed to fetch office data"))
    }
}

export function* officeSaga() {
    yield takeLatest(fetchOfficeDataRequest.type, fetchOfficeData)
}
