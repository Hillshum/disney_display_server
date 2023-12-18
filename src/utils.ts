
const isFullfilled = <T>(promise: PromiseSettledResult<T>):  promise is PromiseFulfilledResult<T> => {
    return promise.status === 'fulfilled';
}

const isRejected = <T>(promise: PromiseSettledResult<T>):  promise is PromiseRejectedResult => {
    return promise.status === 'rejected';
}

export {isFullfilled, isRejected}