const State = require('.../model/States');
const statesData = require('../statesData.json');

const mergeState = (stateData, mongoState) => {
    if (mongoState?.funfacts?.length > 0) {
        return { ...stateData, funfacts: mongoState.funfacts };
    }
    return stateData;
};


//get all states
const getAllStates = async (req, res) => {
    const mongoStates = await State.find();

    let states = statesData;

    const { contig } = req.query;
    if (contig === 'true') {
        states = states.filter(s => s.code !== 'AK' && s.code !== 'HI');
    } else if (contig === 'false') {
        states = states.filter(s => s.code === 'AK' || s.code === 'HI');
    }


    const result = states.map(state => {
        const mongoState = mongoStates.find(m => m.stateCode === state.code);
        if (mongoState?.funfacts?.length > 0) {
            return { ...state, funfacts: mongoState.funfacts };
        }
        return state;
    });

    res.json(result);
};

//get state
const getState = async (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    const mongoState = await State.findOne({ stateCode: req.code });


    if (mongoState) {
        return res.json({ ...stateData, funfacts: mongoState.funfacts });
    }
    res.json(stateData);
};

//get funfact
const getFunFact = async (req, res) => {
    const mongoState = await State.findOne({ stateCode: req.code });

    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        const stateData = statesData.find(s => s.code === req.code);
        return res.status(404).json({ message: `No Fun Facts found for ${stateData.state}` });
    }

    const randomIndex = Math.floor(Math.random() * mongoState.funfacts.length);
    res.json({ funfact: mongoState.funfacts[randomIndex] });
};

//get capital
const getCapital = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, capital: stateData.capital_city });
};

//get nickname
const getNickname = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, nickname: stateData.nickname });
};

//get population
const getPopulation = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, population: stateData.population.toLocaleString('en-US') });
};

//get admission 
const getAdmission = (req, res) => {
    const stateData = statesData.find(s => s.code === req.code);
    res.json({ state: stateData.state, admitted: stateData.admission_date });
};

//post funfact 
const addFunFact = async (req, res) => {
    const { funfacts } = req.body;

    if (!funfacts) {
        return res.status(400).json({ message: 'Missing value' });
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({ message: 'Incorrect value type. Value must be an array' });
    }

    const mongoState = await State.findOne({ stateCode: req.code });

    if (mongoState) {
        mongoState.funfacts.push(...funfacts);
        const result = await mongoState.save();
        return res.json(result);
    }

    const result = await State.create({ stateCode: req.code, funfacts });
    res.json(result);
};

//update funfact 
const updateFunFact = async (req, res) => {
    const { index, funfact } = req.body;
    const stateData = statesData.find(s => s.code === req.code);

    if (!index) {
        return res.status(400).json({ message: 'Invalid value entered' });
    }
    if (!funfact) {
        return res.status(400).json({ message: 'Missing value' });
    }


    const mongoState = await State.findOne({ stateCode: req.code });
    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No fun facts found for ${stateData.state}` });
    }


    const adjustedIndex = index - 1;
    if (adjustedIndex < 0 || adjustedIndex >= mongoState.funfacts.length) {
        return res.status(404).json({ message: `No fun fact found using this entry for ${stateData.state}` });
    }

    mongoState.funfacts[adjustedIndex] = funfact;
    const result = await mongoState.save();
    res.json(result);
};

//delete funfact
const deleteFunFact = async (req, res) => {
    const { index } = req.body;
    const stateData = statesData.find(s => s.code === req.code);

    if (!index) {
        return res.status(400).json({ message: 'Invalid value entered' });
    }

    const mongoState = await State.findOne({ stateCode: req.code });
    if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
        return res.status(404).json({ message: `No fun facts found for ${stateData.state}` });
    }

    const adjustedIndex = index - 1;
    if (adjustedIndex < 0 || adjustedIndex >= mongoState.funfacts.length) {
        return res.status(404).json({ message: `No fun fact found using this entry for ${stateData.state}` });
    }

    mongoState.funfacts.splice(adjustedIndex, 1);
    const result = await mongoState.save();
    res.json(result);
};

module.exports = {
    getAllStates,
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    addFunFact,
    updateFunFact,
    deleteFunFact
};