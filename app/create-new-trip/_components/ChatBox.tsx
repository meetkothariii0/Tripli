"use client";
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import EmptyBoxState from '@/app/create-new-trip/_components/EmptyBoxState';
import GroupSizeUi from './GroupSizeUi';
import BudgetUi from './BudgetUi';
import FinalUi from './FinalUi';
import SelectDays from './SelectDays';
import TripTypeUi from './TripTypeUi';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserDetail } from '@/app/Provider';
import { v4 as uuidv4 } from 'uuid';

type Message = {
	role: string;
	content: string;
	ui?: string | null;
};

type Restaurant = {
	name: string;
	cuisine_type: string;
	price_range: string;
	average_cost_for_two: string;
	must_try_dishes: string[];
	address: string;
	google_maps_link: string;
	rating: number;
	image_url?: string;
	best_time_to_visit?: string;
	reservation_recommended?: boolean;
};

type Activity = {
	place_name: string;
	place_details: string;
	ticket_pricing?: string;
	time_travel_each_location?: string;
	recommended_duration?: string;
	google_maps_link: string;
};

type TripInfo = {
	budget: string;
	destination: string;
	duration: string;
	group_size: string;
	origin: string;
	trip_type: string;
	hotels?: Array<{
		hotel_name: string;
		hotel_address: string;
		price_per_night: string;
		hotel_image_url: string;
		rating: number;
		description: string;
		google_maps_link: string;
		amenities?: string[];
		recommended_for?: string[];
		location_benefits?: string[];
		popular_nearby_spots?: string[];
		check_in_time?: string;
		check_out_time?: string;
	}>;
	restaurants?: {
		budget_friendly: Restaurant[];
		mid_range: Restaurant[];
		luxury: Restaurant[];
		local_specialties: Restaurant[];
	};
	itinerary?: {
		[key: string]: {
			day_title: string;
			activities: Activity[];
			recommended_transport?: string;
			tips?: string[];
			recommended_restaurants: {
				breakfast?: Restaurant;
				lunch?: Restaurant;
				dinner?: Restaurant;
				cafes_and_snacks?: Restaurant[];
			};
		};
	};
};

const extractValue = (text: string = '', key: string): string => {
	const regex = new RegExp(`${key}\\s*([^-]+)`);
	const match = text.match(regex);
	return match ? match[1].trim() : '';
};

const extractFromMessages = (messages: Message[], keyword: string): string => {
	const relevantMessage = messages.find(m => 
		m.content.toLowerCase().includes(keyword.toLowerCase())
	);
	return relevantMessage ? extractValue(relevantMessage.content, keyword) : '';
};

const allDetailsCollected = (tripData: any): boolean => {
	const requiredFields = ['origin', 'destination', 'duration', 'group_size', 'budget'];
	return requiredFields.every(field => Boolean(tripData[field]));
};

function ChatBox() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [userInput, setUserInput] = useState<string>("");
	const [isFinal, setIsFinal] = useState<boolean>(false);
	const [tripDetails, setTripDetails] = useState<TripInfo | null>(null);
	const [currentStep, setCurrentStep] = useState<number>(0);
	const SaveTripDetail = useMutation(api.TripDetail.CreateTripDetail);
	const { user: userDetails } = useUserDetail();

	type TripType = 'Adventure' | 'Sightseeing' | 'Cultural' | 'Relaxation' | 'Shopping' | 'Food Tour';

	// Define the conversation flow with fixed order
	const conversationSteps = [
		{ 
			step: 1,
			question: "Where are you traveling from?", 
			ui: null,
			field: 'origin'
		},
		{ 
			step: 2,
			question: "Where would you like to go?", 
			ui: null,
			field: 'destination'
		},
		{ 
			step: 3,
			question: "How many people will be traveling?", 
			ui: "groupSize",
			field: 'group_size'
		},
		{ 
			step: 4,
			question: "What's your budget per person?", 
			ui: "budget",
			field: 'budget'
		},
		{ 
			step: 5,
			question: "How many days do you have?", 
			ui: "tripDuration",
			field: 'duration'
		},
		{ 
			step: 6,
			question: "What type of trip would you like to plan?", 
			ui: "tripType",
			field: 'trip_type'
		},
		{ 
			step: 7,
			question: "Perfect! Here are the details of your trip:", 
			ui: "final",
			field: 'final'
		}
	];
	const onSend = async () => {
		if (!userInput.trim()) return;
		setLoading(true);

		const newMsg: Message = {
			role: 'user',
			content: userInput
		};

		// Always add user message to chat
		setUserInput('');
		setMessages(prev => [...prev, newMsg]);

		try {
			// First, make the regular API call to get response

			let result;
			try {
				result = await axios.post('/api/aimodel', {
					messages: [...messages, newMsg].map(msg => ({
						role: msg.role,
						content: msg.content
					})),
					isFinal: false
				});
			} catch (error) {
				const err = error as any;
				if (err.response && err.response.status === 500) {
					setError('AI service error: ' + (err.response.data?.error || 'Internal Server Error'));
					console.error('Backend error details:', err.response.data);
				} else {
					setError('Network or unknown error occurred.');
					console.error('Unknown error:', err);
				}
				return;
			}

			// Validate API response
			if (!result?.data) {
				throw new Error("No data received from API");
			}

			// Add type checking for response
			if (typeof result.data !== 'object' || !('resp' in result.data)) {
				throw new Error("Invalid response format from API");
			}

			console.log("Initial API Response:", result.data);

			// Update trip details from the response
			const updatedTripDetails = result.data.trip_plan || {};
			setTripDetails(prev => ({ ...prev, ...updatedTripDetails }));

			// Check if we have all required information
			const hasAllDetails = result.data.trip_plan && 
													result.data.trip_plan.origin && 
													result.data.trip_plan.destination && 
													result.data.trip_plan.duration && 
													result.data.trip_plan.budget && 
													result.data.trip_plan.group_size;

			if (hasAllDetails) {
				try {
					// Format messages for final API call
					const finalMessages = [...messages, newMsg].map(msg => ({
						role: msg.role,
						content: msg.content
					}));

					// Make the final API call
					console.log("All details collected, generating final plan...");
					const finalResult = await axios.post('/api/aimodel', {
						messages: finalMessages,
						isFinal: true
					});

					// Validate the response
					if (!finalResult?.data?.trip_plan) {
						throw new Error("Invalid trip plan received from API");
					}

					// Process successful response
					console.log("Final Trip Plan:", finalResult.data);
					const tripId = uuidv4();

					// Save trip details if user is logged in
					if (userDetails?.id) {
						await SaveTripDetail({
							tripDetail: finalResult.data.trip_plan,
							tripId: tripId,
							uid: userDetails.id
						});
						console.log('Trip details saved successfully');
					} else {
						console.warn('User not logged in. Trip details will not be saved.');
					}

					// Update UI with trip details
					setTripDetails(finalResult.data.trip_plan);
					setMessages(prev => [...prev, {
						role: 'assistant',
						content: `Perfect! I've planned your ${finalResult.data.trip_plan.duration} trip from ${finalResult.data.trip_plan.origin} to ${finalResult.data.trip_plan.destination}. Your trip includes ${finalResult.data.trip_plan.hotels?.length || 0} hotels and a detailed itinerary. Click "View Trip" to see all details!`,
						ui: 'final'
					}]);
					setIsFinal(true);
				} catch (error: any) {
					const errorMsg = (typeof error === 'object' && error !== null)
						? (error.response?.data?.error || error.message || JSON.stringify(error))
						: String(error);
					console.error("Error generating final plan: " + errorMsg);
					setError(errorMsg);
					setMessages(prev => [...prev, {
						role: 'assistant',
						content: `Sorry, there was an error: ${errorMsg}. Please try again.`,
						ui: null
					}]);

				}
			}

			// For regular conversation flow
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: result.data.resp || conversationSteps[currentStep + 1]?.question,
				ui: result.data.ui || conversationSteps[currentStep + 1]?.ui
			}]);
			setCurrentStep(prev => prev + 1);
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages(prev => [...prev, {
				role: 'assistant',
				content: "Sorry, there was an error. Please try again.",
				ui: null
			}]);
		} finally {
			setLoading(false);
		}
	};

	const RenderGenerativeUi = (ui: string | null) => {
		if (!ui) return null;

		const handleOptionSelect = (value: string) => {
			setUserInput(value);
			onSend();
		};

		switch (ui) {
			case 'budget':
				return <BudgetUi onSelectedOption={handleOptionSelect} />;
      
			case 'groupSize':
				return <GroupSizeUi onSelectedOption={handleOptionSelect} />;
      
			case 'tripDuration':
				return <SelectDays onSelectedOption={handleOptionSelect} />;

			case 'tripType':
				return <TripTypeUi onSelectedOption={handleOptionSelect} />;
      
			case 'final':
				const handleViewTrip = () => {
					if (tripDetails) {
						window.location.href = `/trip-details?data=${encodeURIComponent(JSON.stringify(tripDetails))}`;
					}
				};
				return (
					<div className="space-y-4">
						{tripDetails && (
							<div className="bg-white rounded-lg shadow overflow-hidden">
								<table className="min-w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Details</th>
											<th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Information</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										<tr>
											<td className="px-4 py-2 text-sm font-medium text-gray-900">Origin</td>
											<td className="px-4 py-2 text-sm text-gray-500">{tripDetails.origin}</td>
										</tr>
										<tr>
											<td className="px-4 py-2 text-sm font-medium text-gray-900">Destination</td>
											<td className="px-4 py-2 text-sm text-gray-500">{tripDetails.destination}</td>
										</tr>
										<tr>
											<td className="px-4 py-2 text-sm font-medium text-gray-900">Duration</td>
											<td className="px-4 py-2 text-sm text-gray-500">{tripDetails.duration}</td>
										</tr>
										<tr>
											<td className="px-4 py-2 text-sm font-medium text-gray-900">Group Size</td>
											<td className="px-4 py-2 text-sm text-gray-500">{tripDetails.group_size}</td>
										</tr>
										<tr>
											<td className="px-4 py-2 text-sm font-medium text-gray-900">Budget</td>
											<td className="px-4 py-2 text-sm text-gray-500">{tripDetails.budget}</td>
										</tr>
									</tbody>
								</table>
							</div>
						)}
						<FinalUi viewTrip={handleViewTrip} disable={!tripDetails} />
					</div>
				);
      
			default:
				return null;
		}
	};

	// Initialize conversation
	useEffect(() => {
		if (messages.length === 0) {
			setMessages([{
				role: 'assistant',
				content: conversationSteps[0].question,
				ui: conversationSteps[0].ui
			}]);
		}
	}, []);

	return (
		<div className='h-[85vh] flex flex-col'>
			{messages.length === 0 && (
				<div className="flex justify-center items-center h-full">
					<Loader className="animate-spin" />
				</div>
			)}

			<section className='flex-1 overflow-y-auto p-4'>
				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
						<div className="flex">
							<div className="ml-3">
								<p className="text-sm text-red-700">
									{error}
								</p>
							</div>
						</div>
					</div>
				)}
				{messages.map((msg, index) =>
					msg.role === 'user' ? (
						<div key={index} className='flex justify-end mt-2'>
							<div className='max-w-lg bg-primary text-white px-4 py-2 rounded-lg'>
								{msg.content}
							</div>
						</div>
					) : (
						<div key={index} className='flex justify-start mt-2'>
							<div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
								{msg.content}
								{!error && RenderGenerativeUi(msg.ui ?? '')}
							</div>
						</div>
					)
				)}

				{loading && (
					<div className='flex justify-start mt-2'>
						<div className='max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg'>
							<Loader className='animate-spin' />
						</div>
					</div>
				)}
			</section>
			<section>
				<div className='border rounded-2xl p-4 shadow relative'>
					<Textarea
						placeholder='Start typing here...'
						className='w-full h-28 bg-transparent border-none focus-visible:ring-0 resize-none'
						onChange={(event) => setUserInput(event.target.value ?? '')}
						value={userInput}
					/>
					<Button
						size={'icon'}
						className='absolute right-4 bottom-4'
						onClick={onSend}
					>
						<Send className='h-6 w-6' />
					</Button>
				</div>
			</section>
		</div>

	);
}

export default ChatBox;
