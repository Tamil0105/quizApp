import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineDesktop } from 'react-icons/ai';
import { GiMechanicGarage } from 'react-icons/gi';
import { MdComputer } from 'react-icons/md';

interface User {
    role?: string;
    department?: string;
    name?: string;
}

function parseJwt(token: any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
const CoursePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Fetch token from localStorage
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Decode the token to get user data
                const decodedToken: any = parseJwt(token);
                setUser(decodedToken);
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>; // Handle loading state if needed
    }

    const isAdmin = user?.role === 'ADMIN';

    const courses = isAdmin
        ? [
            { path: 'eee', icon: <AiOutlineDesktop className="text-6xl mb-4" />, label: 'EEE', borderColor: 'border-blue-300', backgroundImage: '/path-to-your-pattern1.png' },
            { path: 'mech', icon: <GiMechanicGarage className="text-6xl mb-4" />, label: 'MECH', borderColor: 'border-red-300', backgroundImage: '/path-to-your-pattern2.png' },
            { path: 'ece', icon: <MdComputer className="text-6xl mb-4" />, label: 'ECE', borderColor: 'border-green-300', backgroundImage: '/path-to-your-pattern3.png' },
        ]
        : [
            { path: user?.department, icon: <AiOutlineDesktop className="text-6xl mb-4" />, label: (user as any)?.department.toUpperCase(), borderColor: 'border-blue-300', backgroundImage: '/path-to-your-pattern1.png' },
        ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">Welcome{isAdmin ? '' : ` ${user?.name}`}</h1>
                <h2 className="text-2xl font-semibold mb-6">
                    {isAdmin ? 'Select a Course' : `Department: ${(user as any)?.department.toUpperCase()}`}
                </h2>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-${isAdmin ? '3' : '1'} gap-6`}>
                {courses.map((course, index) => (
                    <Link to={ isAdmin?`/teacher-dashboard/course/${course.path}`:`/student-dashboard/course/${course.path}`} key={index} className="folder-card">
                        <div
                            className={`flex flex-col items-center p-8 bg-white border ${course.borderColor} rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105`}
                            style={{ backgroundImage: `url(${course.backgroundImage})`, backgroundSize: 'cover' }}
                        >
                            {course.icon}
                            <span className="text-xl font-semibold">{course.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CoursePage;
