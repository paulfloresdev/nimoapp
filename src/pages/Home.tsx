import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configStore/store";
import { getYearsWithRequest } from "../store/features/yearsWith/yearsWithSlice";

const Home: React.FC = () => {
    const dispatch = useDispatch();

    const { data: years, loading: loadingYears } = useSelector((state: RootState) => state.years_with);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    useEffect(() => {
        dispatch(getYearsWithRequest());
    }, [dispatch]);
    
    return (
        <div className="w-full">
            {
                loadingYears ? (
                    <span>Cargando...</span>
                ) : (
                    <span>{years?.length}</span>
                )
            }
        </div>
    );
};

export default Home;