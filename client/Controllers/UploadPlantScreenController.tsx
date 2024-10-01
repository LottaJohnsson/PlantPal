import React, { useState } from 'react';
import UploadPlantScreenView from '../Views/uploadPlantScreenView';
import { searchSpecies } from "../../server/Models/plantModel";

type Props = {};

export default function UploadPlantScreenController({}: Props) {
    const [image, setImage] = useState<File | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Search input
    const [searchResult, setSearchResult] = useState<any[]>([]); // Store plant data from API
    const [loading, setLoading] = useState(false); // Track API loading state
    const [formVisible, setFormVisible] = useState(false); // Whether the form is visible
    const [formData, setFormData] = useState({
        name: '',
        lastWatered: '',
        waterFrequency: '',
    });

    // Handle file drop
    const onDrop = (acceptedFiles: File[]) => {
        setImage(acceptedFiles[0]);
    };

    // Handle form field change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle search input change
    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        if (query.length > 2) {
            setLoading(true);
            try {
                const result = await searchSpecies(query); // Fetch plant data from API
    
                // If there are results, store them in state
                if (result && result.length > 0) {
                    setSearchResult(result); 
                } else {
                    setSearchResult([]); 
                }
            } catch (error) {
                console.error('Error fetching plant data:', error);
                setSearchResult([]); 
            } finally {
                setLoading(false); // Stop loading whether successful or not
            }
        } else {
            setSearchResult([]); 
            setLoading(false); 
        }
    };

    // Select plant handler
    const handleSelectPlant = () => {
        setFormVisible(true); // Show the form
    };

    // Handle adding to profile
    const onAddToProfile = () => {
        // Do something with the form data, like submitting to the backend
        console.log('Plant added to profile:', formData, image);
    };

    const isDragActive = image !== null; // Example logic to indicate active drag

    return (
        <UploadPlantScreenView
            image={image}
            searchQuery={searchQuery}
            searchResult={searchResult}
            loading={loading}
            formVisible={formVisible}
            formData={formData}
            handleSearchChange={handleSearchChange}
            handleSelectPlant={handleSelectPlant}
            handleChange={handleChange}
            onDrop={onDrop}
            isDragActive={isDragActive}
            onAddToProfile={onAddToProfile}
        />
    );
}
