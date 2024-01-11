import { useMemo } from 'react';
import { Feature } from "../models/Features";
import { Filters } from "../models/Filters";
import '../Style/feature-display.scss';
import debounce from "lodash.debounce";
import { Category } from '../models/Category';


const FeaturesDisplay = (props: {
    features: Feature[],
    filters: Filters,
    setFilters: (filters: Filters) => void,
    lastPage: number,
    categories: Category[]

}) => {
    const DEBOUNCE_TIME_MS = 500;
    let myMap = new Map<number, string>();
    for (let i = 0; i < props.categories.length; i++) {
        myMap.set(props.categories[i].sid.id, props.categories[i].name);
    }


    const search = useMemo(
        () =>
            debounce((s: string) => {
                props.setFilters({

                    ...props.filters,
                    s: s

                })
            }, DEBOUNCE_TIME_MS),
        [props.filters.s]

    )

    const next = () => {
        props.setFilters({
            ...props.filters,
            page: props.filters.page + 1,
            count: (props.filters.count + 20)

        })
    }

    const prev = () => {
        props.setFilters({
            ...props.filters,
            page: props.filters.page - 1,
            count: (props.filters.count - 20)

        })
    }

    let prevButton;
    if (props.filters.count !== 0) {
        prevButton = <button type="button" className="page-btn" onClick={prev} aria-label="previous page">Prev</button>
    }
    else {
        prevButton = <div className="page-btn-disabled"></div>
    }
    let nextButton;
    if (props.filters.page !== props.lastPage) {
        nextButton = <button type="button" className="page-btn" onClick={next} aria-label="next page">Next</button>
    }
    else {
        nextButton = <div className="page-btn-disabled"></div>
    }

    const filterCategory = (category: string) => {
        props.setFilters({
            ...props.filters,
            category: category
        })

    }

    return (
        <>
            <div className='filter-container'>
                <div className="input-group-append">
                    <div className='categories'>
                        <label htmlFor="category-select"><h5>Category</h5></label>
                        <select className="form-select" id="category-select" onChange={e => filterCategory(e.target.value)}>
                            <option value="0">All</option>
                            {props.categories.map(categories => {
                                return (
                                    <option className="dropdown-text" value={categories.sid.id} key={categories.sid.id}>{categories.name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <div className='search-container'>
                    <label htmlFor="search"><h5>Search</h5></label>
                    <input type="text" className="form-control" placeholder="Search"
                        onChange={e => search(e.target.value)} id="search"
                    />
                </div>
            </div>
            <div className='feature-display-container'>
                <div className="">
                    {props.features.map(Features => {
                        return (
                            <div className="col" key={Features.sid.id}>
                                <div className="card-body"  >
                                    <span className="card-name" ><strong>{Features.displayName}</strong> </span>
                                    <div className="category" >
                                        <span > Category: &nbsp;</span>
                                        <span>{myMap.get(Features.categorySid.id)}</span>
                                    </div>
                                    <div className="keywords" >
                                        {Features.epKeywords.map((keywords, index) => {
                                            if (index === 0) {
                                                return (<span key={index}>Keywords: &nbsp;</span>)
                                            }
                                            return null;
                                        })}
                                        {Features.epKeywords.map((keywords, index) => {
                                            if (index === Features.epKeywords.length - 1) {
                                                return (<span key={index}>{keywords}  </span>)
                                            }
                                            return (<span key={index}>{keywords},&nbsp; </span>)
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            <div className="load-more">
                <div className='buttons'>
                    {prevButton}
                    {nextButton}
                </div>
            </div>
        </>
    );
};

export default FeaturesDisplay;