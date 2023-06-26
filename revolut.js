const RevolutCheckout = require('@revolut/checkout');

class Revolut {
    constructor() {
        this.mode = 'prod';
    }

    static setMode(mode) {
        this.mode = mode;
    }

    static displayPaymentPopup(orderId, onSuccess, onError, onCancel) {
        RevolutCheckout.default(orderId, this.mode).then((instance) => {
            instance.payWithPopup({
                onSuccess,
                onError,
                onCancel
            });
        });
    }
}

module.exports = { Revolut };