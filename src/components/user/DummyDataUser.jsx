// src/components/DummyData.jsx
import React from 'react';

const DummyData = ({ onUserCreated }) => {
    const apiEndpoint = import.meta.env.VITE_API_URL + '/users'; // Adjust the endpoint for users

    // Updated dummy data for users insertion
    const dummyData = 
        [
            {
              "name": "John Doe",
              "email": "johndoe@example.com",
              "password": "password123",
              "isServiceProvider": true,
              "role": "user",
              "image": "https://i.pravatar.cc/150?img=1" ,
              "category": "Musician",
              "profile": {
                "bio": "A talented guitarist with 5 years of experience.",
                "experience": 5
              },
              "servicesProvided": [],
              "bookedEvents": [],
              "location": "New York, USA",
              "votesReceived": 12,
              "budget": 5000,
              "reviews": [
                {
                  "rating": 4.5,
                  "comment": "Great performance at the last event!",
                  "reviewer": "60c72b1f9b1e8b001c9e0a7d"
                },
                {
                  "rating": 5,
                  "comment": "Amazing artist, highly recommended.",
                  "reviewer": "60c72b1f9b1e8b001c9e0a7e"
                }
              ]
            },
            {
              "name": "Jane Smith",
              "email": "janesmith@example.com",
              "password": "password456",
              "isServiceProvider": true,
              "role": "user",
              "image": "https://i.pravatar.cc/150?img=2" ,
              "category": "Painter",
              "profile": {
                "bio": "A professional painter specializing in abstract art.",
                "experience": 10
              },
              "servicesProvided": [],
              "bookedEvents": [],
              "location": "Los Angeles, USA",
              "votesReceived": 8,
              "budget": 4000,
              "reviews": [
                {
                  "rating": 4,
                  "comment": "Her art speaks for itself, highly creative.",
                  "reviewer": "60c72b1f9b1e8b001c9e0a7f"
                }
              ]
            },
            {
              "name": "Mark Johnson",
              "email": "markj@example.com",
              "password": "password789",
              "isServiceProvider": false,
              "role": "user",
              "image": "https://i.pravatar.cc/150?img=3" ,
              "category": null,
              "servicesProvided": [],
              "bookedEvents": ["60c72b1f9b1e8b001c9e0a80"],
              "location": "Chicago, USA",
              "votesReceived": 0,
              "budget": 10000,
              "reviews": []
            },
            {
              "name": "Alice Cooper",
              "email": "alicec@example.com",
              "password": "password111",
              "isServiceProvider": true,
              "role": "admin",
              "image": "https://i.pravatar.cc/150?img=4" ,
              "category": "Comedian",
              "profile": {
                "bio": "Stand-up comedian with a knack for observational humor.",
                "experience": 7
              },
              "servicesProvided": [],
              "bookedEvents": [],
              "location": "Miami, USA",
              "votesReceived": 15,
              "budget": 6000,
              "reviews": [
                {
                  "rating": 5,
                  "comment": "She made the whole event so much fun!",
                  "reviewer": "60c72b1f9b1e8b001c9e0a81"
                }
              ]
            },
            {
              "name": "David Brown",
              "email": "davidb@example.com",
              "password": "password222",
              "isServiceProvider": false,
              "role": "user",
              "image": "https://i.pravatar.cc/150?img=5" ,
              "category": null,
              "servicesProvided": [],
              "bookedEvents": ["60c72b1f9b1e8b001c9e0a82"],
              "location": "Houston, USA",
              "votesReceived": 0,
              "budget": 3000,
              "reviews": []
            },
            {
                "name": "Sophia Williams",
                "email": "sophiaw@example.com",
                "password": "password333",
                "isServiceProvider": true,
                "role": "user",
                "image": "https://i.pravatar.cc/150?img=6" ,
                "category": "Dancer",
                "profile": {
                  "bio": "Professional dancer specializing in contemporary and ballet.",
                  "experience": 6
                },
                "servicesProvided": [],
                "bookedEvents": [],
                "location": "San Francisco, USA",
                "votesReceived": 10,
                "budget": 5500,
                "reviews": [
                  {
                    "rating": 4.8,
                    "comment": "Her dance moves are breathtaking!",
                    "reviewer": "60c72b1f9b1e8b001c9e0a83"
                  }
                ]
              },
              {
                "name": "Michael Green",
                "email": "michaelg@example.com",
                "password": "password444",
                "isServiceProvider": true,
                "role": "user",
                "image": "https://i.pravatar.cc/150?img=7" ,
                "category": "Photographer",
                "profile": {
                  "bio": "Event and wedding photographer with over 8 years of experience.",
                  "experience": 8
                },
                "servicesProvided": [],
                "bookedEvents": [],
                "location": "Boston, USA",
                "votesReceived": 18,
                "budget": 7000,
                "reviews": [
                  {
                    "rating": 5,
                    "comment": "Captured every moment beautifully!",
                    "reviewer": "60c72b1f9b1e8b001c9e0a84"
                  },
                  {
                    "rating": 4.7,
                    "comment": "Amazing photographer, highly recommended.",
                    "reviewer": "60c72b1f9b1e8b001c9e0a85"
                  }
                ]
              },
              {
                "name": "Emma Davis",
                "email": "emmad@example.com",
                "password": "password555",
                "isServiceProvider": true,
                "role": "user",
                "image": "https://i.pravatar.cc/150?img=8" ,
                "category": "Musician",
                "profile": {
                  "bio": "Pianist with a passion for classical and jazz music.",
                  "experience": 12
                },
                "servicesProvided": [],
                "bookedEvents": [],
                "location": "Seattle, USA",
                "votesReceived": 22,
                "budget": 8000,
                "reviews": [
                  {
                    "rating": 5,
                    "comment": "She plays with such emotion, beautiful performance.",
                    "reviewer": "60c72b1f9b1e8b001c9e0a86"
                  }
                ]
              },
              {
                "name": "Oliver White",
                "email": "oliverw@example.com",
                "password": "password666",
                "isServiceProvider": false,
                "role": "user",
                "image": "https://i.pravatar.cc/150?img=9" ,
                "category": null,
                "servicesProvided": [],
                "bookedEvents": ["60c72b1f9b1e8b001c9e0a87"],
                "location": "Dallas, USA",
                "votesReceived": 0,
                "budget": 12000,
                "reviews": []
              },
              {
                "name": "Isabella Clark",
                "email": "isabellac@example.com",
                "password": "password777",
                "isServiceProvider": true,
                "role": "user",
                "image": "https://i.pravatar.cc/150?img=10" ,
                "category": "Painter",
                "profile": {
                  "bio": "Acrylic painter known for vibrant and abstract pieces.",
                  "experience": 9
                },
                "servicesProvided": [],
                "bookedEvents": [],
                "location": "San Diego, USA",
                "votesReceived": 5,
                "budget": 6500,
                "reviews": [
                  {
                    "rating": 4.5,
                    "comment": "Her artwork is so colorful and unique.",
                    "reviewer": "60c72b1f9b1e8b001c9e0a88"
                  }
                ]
              }
          ]
          
    

    const handleInsertDummyData = async () => {
        try {
            const responses = await Promise.all(
                dummyData.map((user) =>
                    fetch(apiEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user),
                    })
                )
            );

            if (responses.every((response) => response.ok)) {
                alert('Dummy data added successfully!');
                onUserCreated(); // Trigger a refresh after adding dummy data
            } else {
                alert('Failed to add some of the dummy data.');
            }
        } catch (error) {
            console.error('Error inserting dummy data:', error);
            alert('Error adding dummy data.');
        }
    };

    return (
        <button onClick={handleInsertDummyData} className="btn btn-secondary">
            DEMO
        </button>
    );
};

export default DummyData;
