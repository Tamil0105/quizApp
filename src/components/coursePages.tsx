import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AiOutlineDesktop } from 'react-icons/ai';
import { GiMechanicGarage } from 'react-icons/gi';
import { MdComputer } from 'react-icons/md';

const CoursePage: React.FC = () => {
    const { setTests } = useStore();
    const location = window.location.href;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center mb-12">Select Your Course</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to={`${location}/eee`} className="folder-card">
                    <div
                        onClick={() => setTests()}
                        className="flex flex-col items-center p-8 bg-white border border-blue-300 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                        style={{ backgroundImage: 'url(/path-to-your-pattern1.png)', backgroundSize: 'cover' }}
                    >
                        <AiOutlineDesktop className="text-6xl mb-4" />
                        <span className="text-xl font-semibold">EEE</span>
                    </div>
                </Link>
                <Link to={`${location}/mech`} className="folder-card">
                    <div
                        onClick={() => setTests()}
                        className="flex flex-col items-center p-8 bg-white border border-red-300 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                        style={{ backgroundImage: 'url(/path-to-your-pattern2.png)', backgroundSize: 'cover' }}
                    >
                        <GiMechanicGarage className="text-6xl mb-4" />
                        <span className="text-xl font-semibold">MECH</span>
                    </div>
                </Link>
                <Link to={`${location}/ece`} className="folder-card">
                    <div
                        onClick={() => setTests()}
                        className="flex flex-col items-center p-8 bg-white border border-green-300 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                        style={{ backgroundImage: 'url(/path-to-your-pattern3.png)', backgroundSize: 'cover' }}
                    >
                        <MdComputer className="text-6xl mb-4" />
                        <span className="text-xl font-semibold">ECE</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default CoursePage;
