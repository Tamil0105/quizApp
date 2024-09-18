interface courseType {
    icon?: any;
    label: string;
    key: string | number;
    path: string;
};

export const Courses:courseType[] = [
    {
        icon: '',
        label: 'Civil',
        key: 'civil',
        path: 'civil',
    },
    {
        icon: '',
        label: 'Mech',
        key: 'mech',
        path: 'mech',
    },
    {
        icon: '',
        label: 'EEE',
        key: 'eee',
        path: 'eee'
    },
    {
        icon: '',
        label: 'ECE',
        key: 'ece',
        path: 'ece'
    },
    {
        icon: '',
        label: 'CSE',
        key: 'cse',
        path: 'cse'
    }
]