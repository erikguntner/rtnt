import { put, takeEvery, all } from 'redux-saga/effects'
import { addPointSaga } from '../features/Map/routeSlice';

function* watchMapAsync() {
  yield takeEvery('ADD_POINT', addPointSaga)
}

export default function* rootSaga() {
  yield all([
    watchMapAsync()
  ])
}