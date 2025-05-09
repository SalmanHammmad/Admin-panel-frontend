// src/components/DummyData.jsx
import React from 'react';

const DummyData = ({onEventCreated}) => {
    const apiEndpoint = import.meta.env.VITE_API_URL + '/events'; // Adjust the endpoint as needed

    // Updated dummy data for insertion
    const dummyData = [
        {
            title: 'Tech Conference 2024',
            description: 'Join us for a full day of tech talks and networking with industry leaders.',
            location: 'San Francisco, CA',
            startDate: new Date('2024-01-15T09:00:00Z').toISOString(),
            endDate: new Date('2024-01-15T17:00:00Z').toISOString(),
        },
        {
            title: 'Art Exhibition: Nature & Art',
            description: 'Explore the intersection of nature and creativity in this unique exhibition.',
            location: 'New York City, NY',
            startDate: new Date('2024-02-10T11:00:00Z').toISOString(),
            endDate: new Date('2024-02-10T19:00:00Z').toISOString(),
        },
        {
            title: 'Yoga Retreat',
            description: 'Relax and rejuvenate at our weekend yoga retreat in the mountains.',
            location: 'Aspen, CO',
            startDate: new Date('2024-03-05T08:00:00Z').toISOString(),
            endDate: new Date('2024-03-07T18:00:00Z').toISOString(),
        },
        {
            title: 'Cooking Class: Italian Cuisine',
            description: 'Learn to cook authentic Italian dishes with a professional chef.',
            location: 'Chicago, IL',
            startDate: new Date('2024-04-01T18:00:00Z').toISOString(),
            endDate: new Date('2024-04-01T21:00:00Z').toISOString(),
        },
        {
            title: 'Annual Charity Run',
            description: 'Participate in our annual charity run to support local children’s education.',
            location: 'Los Angeles, CA',
            startDate: new Date('2024-05-15T07:00:00Z').toISOString(),
            endDate: new Date('2024-05-15T12:00:00Z').toISOString(),
        },
        {
            title: 'Book Launch: The Future of AI',
            description: 'Celebrate the launch of the new book on AI advancements and implications.',
            location: 'Seattle, WA',
            startDate: new Date('2024-06-20T17:00:00Z').toISOString(),
            endDate: new Date('2024-06-20T19:00:00Z').toISOString(),
        },
        {
            title: 'Live Music Festival',
            description: 'Enjoy live performances from top artists at our annual music festival.',
            location: 'Austin, TX',
            startDate: new Date('2024-07-10T15:00:00Z').toISOString(),
            endDate: new Date('2024-07-12T23:00:00Z').toISOString(),
        },
        {
            title: 'Photography Workshop',
            description: 'Enhance your photography skills in our immersive workshop with experts.',
            location: 'Miami, FL',
            startDate: new Date('2024-08-05T10:00:00Z').toISOString(),
            endDate: new Date('2024-08-05T15:00:00Z').toISOString(),
        },
        {
            title: 'Business Networking Gala',
            description: 'Network with professionals from various industries at this exclusive gala.',
            location: 'New York City, NY',
            startDate: new Date('2024-09-25T18:00:00Z').toISOString(),
            endDate: new Date('2024-09-25T22:00:00Z').toISOString(),
        },
        {
            title: 'Science Fair 2024',
            description: 'Showcase your innovative projects and ideas at the annual science fair.',
            location: 'Philadelphia, PA',
            startDate: new Date('2024-10-15T09:00:00Z').toISOString(),
            endDate: new Date('2024-10-15T17:00:00Z').toISOString(),
        },
        {
            title: 'Fashion Week',
            description: 'Experience the latest trends and styles at the renowned Fashion Week.',
            location: 'Paris, France',
            startDate: new Date('2024-11-01T10:00:00Z').toISOString(),
            endDate: new Date('2024-11-05T20:00:00Z').toISOString(),
        },
        {
            title: 'Cultural Heritage Festival',
            description: 'Celebrate diverse cultures through food, music, and art at this festival.',
            location: 'Toronto, Canada',
            startDate: new Date('2024-12-10T11:00:00Z').toISOString(),
            endDate: new Date('2024-12-10T20:00:00Z').toISOString(),
        },
        {
            title: 'Health & Wellness Expo',
            description: 'Discover the latest trends in health and wellness at our annual expo.',
            location: 'Orlando, FL',
            startDate: new Date('2024-01-20T09:00:00Z').toISOString(),
            endDate: new Date('2024-01-20T18:00:00Z').toISOString(),
        },
        {
            title: 'Blockchain Summit 2024',
            description: 'Join industry experts to discuss the future of blockchain technology.',
            location: 'San Francisco, CA',
            startDate: new Date('2024-02-25T09:00:00Z').toISOString(),
            endDate: new Date('2024-02-25T17:00:00Z').toISOString(),
        },
        {
            title: 'Eco-Friendly Living Workshop',
            description: 'Learn how to live sustainably and reduce your carbon footprint.',
            location: 'Boulder, CO',
            startDate: new Date('2024-03-15T10:00:00Z').toISOString(),
            endDate: new Date('2024-03-15T14:00:00Z').toISOString(),
        },
        {
            title: 'Virtual Reality Gaming Expo',
            description: 'Experience the latest VR games and technologies at our expo.',
            location: 'Los Angeles, CA',
            startDate: new Date('2024-04-20T11:00:00Z').toISOString(),
            endDate: new Date('2024-04-20T19:00:00Z').toISOString(),
        },
        {
            title: 'Annual Community Clean-up',
            description: 'Join us in keeping our community clean and green through volunteer work.',
            location: 'Houston, TX',
            startDate: new Date('2024-05-25T09:00:00Z').toISOString(),
            endDate: new Date('2024-05-25T13:00:00Z').toISOString(),
        },
        {
            title: 'Annual Sports Day',
            description: 'A day filled with fun sports activities for all ages in the community.',
            location: 'Miami, FL',
            startDate: new Date('2024-06-15T09:00:00Z').toISOString(),
            endDate: new Date('2024-06-15T17:00:00Z').toISOString(),
        },
        {
            title: 'Sustainable Fashion Show',
            description: 'Explore sustainable fashion trends and ethical practices in the industry.',
            location: 'New York City, NY',
            startDate: new Date('2024-07-30T18:00:00Z').toISOString(),
            endDate: new Date('2024-07-30T21:00:00Z').toISOString(),
        },
    ];

    const handleInsertDummyData = async () => {
        try {
            const responses = await Promise.all(
                dummyData.map((event) =>
                    fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(event),
                    })
                )
            );

            if (responses.every((response) => response.ok)) {
                alert('Dummy data added successfully!');
                onEventCreated(); // Trigger a refresh after adding dummy data
                
            } else {
                alert('Failed to add some of the dummy data.');
            }
        } catch (error) {
            console.error('Error inserting dummy data:', error);
            alert('Error adding dummy data.');
        }
    };

    return (
        <button className="btn btn-secondary"  onClick={handleInsertDummyData} >
            DEMO
        </button>
    );
};

export default DummyData;
