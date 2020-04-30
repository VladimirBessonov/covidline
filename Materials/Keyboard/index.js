const calcKeyboard = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0'],['SEND']
];

const reportActions = [
    [{text: 'Display', callback_data: '1'},{text: 'Display Current Week', callback_data: '2'}],
    [{text: 'Send report', callback_data: '3'}, {text: 'Delete Temp Measurements', callback_data: 'deleteTemp'}],

];

module.exports = {
    calcKeyboard,
    reportActions
}