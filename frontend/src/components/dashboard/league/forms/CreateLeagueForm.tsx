import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useForm from "../../../../hooks/useForm";
import { closeModal } from "../../../../store/slices/modalSlice";
import { AppDispatch } from "../../../../store/store";
import { CreateLeagueFormData, validateCreateLeague } from "../../../../utils/league/formValidation";
import FormInput from "../../../ui/forms/FormInput";
import SubmitButton from "../../../ui/forms/SubmitButton";
import leagueService from "../../../../services/league/leagueService";
import { CreateLeagueResponse } from "../../../../../generated-api/index"
import { ResponseError } from "../../../../types/auth";


const CreateLeagueForm: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [responseError, setResponseError] = useState()
    const onSubmit = async (values: CreateLeagueFormData) : Promise<void> => {
        // try {
        //     const createLeagueResponse : CreateLeagueResponse = await leagueService.createLeague(values.name, Number(values.seasonId))
        //     if (createLeagueResponse.statusCode == 201) {
            
        //     } else if (createLeagueResponse.statusCode && createLeagueResponse.message) {
        //         setResponseError({
        //             statusCode: createLeagueResponse.statusCode ? createLeagueResponse.statusCode : 500,
        //             message: createLeagueResponse.message ? createLeagueResponse
        //         });
        //     }
        // }

        dispatch(closeModal());
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitDisabled } = useForm<CreateLeagueFormData>({
        initialValues: { name: "", seasonId: 47 },
        validate : validateCreateLeague,
        onSubmit,
        requiredFields: ["name", "seasonId"]
    });

   


    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white">
            <FormInput
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                onBlur={() => {}}
                error={errors.name}
                required
            />
            <FormInput
                label="SeasonId"
                name="season"
                type="text"
                value={values.seasonId}
                onChange={handleChange}
                onBlur={() => {}}
                error={errors.seasonId}
                required
            />
            {responseError && <p className="text-red-500 text-center py-2">{responseError.message}</p>}
            <SubmitButton disabled={isSubmitDisabled} label="Log In" />
        </form>
    );
};

export default CreateLeagueForm;