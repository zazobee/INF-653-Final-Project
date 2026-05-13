const statesData = require('../statesData.json');
const stateCodes = statesData.map(state => state.code);

const verifyStates = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();
    if (!stateCodes.includes(stateCode)) {
        return res.status(404).json({ message: 'Invalid entry' });
    }

    req.code = stateCode;
    next();
};

module.exports = verifyStates;


