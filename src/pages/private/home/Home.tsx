import RegisterTransaction from "./RegisterTransaction";

const Home: React.FC = () => {
    
    

    /*
    const { data: years, loading: loadingYears } = useSelector((state: RootState) => state.years_with);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);

    useEffect(() => {
        dispatch(getYearsWithRequest());
    }, [dispatch]);
    */
    
    return (
        <div className="w-full lg:h-dscreen">
            <RegisterTransaction/>
            {/*<Tabs
                variant="bordered"
            >
                {homeMenu.map((op) => (
                    <Tab key={op.key} title={op.label}>
                        <TabContent page={op.key}/>
                    </Tab>
                ))}
            </Tabs>*/}
        </div>
    );
};

export default Home;