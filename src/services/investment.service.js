import { getCompaniesByCategory } from "../db/company.queries.js";

const categories = [
     {
        code: "ETF",
        label: "Exchange Traded Funds",
        description: "Diversified index-tracking funds"
    },
    {
        code: "MTF",
        label: "Mutual Funds",
        description: "Actively managed fund schemes"
    },
    {
        code: "BONDS",
        label: "Bonds",
        description: "Fixed income gov & corporate bonds"
    },
    {
        code: "SHARES",
        label: "Shares & Stocks",
        description: "Direct equity in listed companies"
    }
];

const getCategories = ()=>{
    return categories;
}

const getCompanies = async(category)=>{
    const validateCategories = categories.map(c => c.code);

    if(!validateCategories.includes(category))
    {
        throw new Error("Invalid Category");
    }

    const companies = await getCompaniesByCategory(category);

    return{
        category,
        companies
    };
};

export default {getCategories,getCompanies};