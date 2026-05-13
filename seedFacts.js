require('dotenv').config();
const mongoose = require('mongoose');
const State = require('../model/States');

const connectDB = async () => {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('connected to mongodb');
};

const seedStates = [
    {
        stateCode: 'KS',
        funfacts: [
            'The center of the state is in Barton.',
            'One of the most popular fruits is the Native Plum.',
            'The highest point in this state is measured at 4,039 feet.',
        ]
    },
    {
        stateCode: 'MO',
        funfacts: [
            'The current flag design was adopted in 1913.',
            'The state rock is a Mozarkite.',
            'The center of the state is located in Miller.',
        ]
    },
    {
        stateCode: 'OK',
        funfacts: [
            'The state fruit is a strawberry.',
            'The highest point in this state is measured at 4,973 feet.',
            'The state tree is the Eastern Redbud.',
        ]
    },
    {
        stateCode: 'NE',
        funfacts: [
            'The state tree is the Eastern Cottonwood.',
            'The state gemstone is a Blue Agate.',
            'The state fruit is an apricot.',
        ]
    },
    {
        stateCode: 'CO',
        funfacts: [
            'This state is bordered by 7 other states in the US.',
            'The currernt flag design was adopted in 1911.',
            'The state animal is a Rocky Mountain Bighorn Sheep.',
        ]
    },
];

const seed = async () => {
    await connectDB();

    await State.deleteMany({});
    console.log('all data removed');

    await State.insertMany(seedStates);
    console.log('seed succces');

    process.exit(0);
};

seed();
