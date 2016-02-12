'use strict';

var invoiceService = require("../services/invoiceService");
var paymentValidator = require("../lib/paymentValidator");
var ChargeCardError = require('../errors/ChargeCardError');
var logger = require('../lib/logger');

function sendResponseToUser(res) {
    return function () {
        res.status(200).json({});
    }
}

function handleError(res) {
    return function (error) {
        if (error instanceof ChargeCardError) {
            res.status(400).json({errors: error.message})
        } else {
            logger.logError('invoicesController', error);
            res.status(500).json({errors: "An error has occurred internally."});
        }
    }
}

var updateInvoiceHandler = (req, res) => {

    let newInvoice = {
        totalAmount: req.body.paymentType === 'noContribute' ? 0 : req.body.totalAmount,
        paymentType: req.body.paymentType,
        stripeToken: req.body.stripeToken,
        invoiceId: req.body.invoiceId
    };
    let validationErrors;
    if (req.body.paymentType === 'noContribute') {
        validationErrors = paymentValidator.isValidNoContribute(newInvoice);
    } else {
        validationErrors = paymentValidator.isValid(newInvoice);
    }

    if (validationErrors.length > 0) {
        return res.status(400).json({errors: validationErrors});
    }

    return invoiceService.payForInvoice(newInvoice)
        .then(sendResponseToUser(res))
        .catch(handleError(res));
};

function acceptPayment(req, res) {
    let reference = req.params.reference;

    return invoiceService.confirmPayment(reference)
        .tap(() => {
            logger.logInfoEvent(['invoice-payment-accepted'], 'With reference: ' + reference);
        })
        .then(sendResponseToUser(res))
        .catch((error) => {
            logger.logError(error, 'Payment could not be accepted with reference: ' + reference);
            return res.status(500).json({errors: 'Payment could not be accepted'});
        });
}

module.exports = {
    updateInvoiceHandler: updateInvoiceHandler,
    confirmPayment: acceptPayment
};
