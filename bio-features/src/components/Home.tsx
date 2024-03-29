import { useEffect, useState } from 'react';
import data from '../FeaturesEndpointResponse .json'
import { Feature } from '../models/Features';
import FeaturesDisplay from './Features-Display';
import { Filters } from '../models/Filters';
import { Category } from '../models/Category';


const Home = () => {
    const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
    const [filteredFeatures, setFilteredFeatures] = useState<Feature[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [map, setMap] = useState<Map<string,Feature[]>>(new Map());
    const [categoryMap, setCategoryMap] = useState<Map<number,string>>(new Map());
    const [filters, setFilters] = useState<Filters>({
        s: '',
        page: 1,
        count: 0,
        category: '0'
    })
    const [lastPage, setLastPage] = useState(0);
    const perPage = 20;

    const quickSort = (arr: string | any[]) => {
        if (arr.length <= 1) {
            return arr;
        }
        let pivot = arr[0];
        let leftArr = [];
        let rightArr = [];

        for (let i = 1; i < arr.length; i++) {
            if (arr[i].displayName.toLowerCase() < pivot.displayName.toLowerCase()) {
                leftArr.push(arr[i]);
            } else {
                rightArr.push(arr[i]);
            }
        }
        const array: any = [...quickSort(leftArr), pivot, ...quickSort(rightArr)]
        return array;
    };

    useEffect(() => {
        const features = data.data.features;
        const categories = data.data.featureCategories;
        (
            async () => {
                await setAllFeatures(features);
                await setFilteredFeatures(quickSort(features.slice(0, 20)));
                await setCategories(categories);
                await setLastPage(Math.floor(features.length / perPage))
                await categories.map(category => setCategoryMap(map => new Map(map.set(category.sid.id,category.name))))
            }
            
        )()
    }, [])

    useEffect(() => {
        let features = allFeatures;
        if (filters.category !== "0") {
            if(map.has(filters.category)){
                features = map.get(filters.category)!;
            }
            else{
                features = features.filter(f => f.categorySid.id === parseInt(filters.category));
                setMap(map => new Map(map.set(filters.category,features)));
            }
        }
        if(filters.s !== ''){
            features = features.filter(f => f.displayName.toLowerCase().indexOf(filters.s.toLowerCase()) >= 0 ||
            f.epKeywords.find(keyword => keyword.toLowerCase().indexOf(filters.s.toLowerCase()) >= 0));
        }
        setLastPage(Math.ceil(features.length / perPage));
        if (features.length === 0) {
            setLastPage(1);
        }
        setFilteredFeatures(quickSort(features.slice(filters.count, filters.page * perPage)));

    }, [filters])

    return (
        <div>
            <FeaturesDisplay features={filteredFeatures} filters={filters} setFilters={setFilters} lastPage={lastPage} categories={categories} categoryMap ={categoryMap} />
        </div>

    );
};

export default Home;