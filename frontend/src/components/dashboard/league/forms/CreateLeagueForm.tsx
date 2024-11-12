import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useForm from "../../../../hooks/useForm";
import { closeModal } from "../../../../store/slices/modalSlice";
import { AppDispatch } from "../../../../store/store";
import {
  CreateLeagueFormData,
  validateCreateLeague,
} from "../../../../utils/league/formValidation";
import FormInput from "../../../ui/forms/FormInput";
import SubmitButton from "../../../ui/forms/SubmitButton";
import CloseIcon from "../../../../assets/close.svg";
import leagueService from "../../../../services/league/leagueService";
import { CreateLeagueResponse } from "../../../../../generated-api";
import { useNavigate } from "react-router-dom";

interface CreateLeagueFormProps {
    setShowCreateLeagueForm: React.Dispatch<React.SetStateAction<boolean>>;
  }
  

const CreateLeagueForm: React.FC<CreateLeagueFormProps> = ({setShowCreateLeagueForm}) => {
  const [responseError, setResponseError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (values: CreateLeagueFormData): Promise<void> => {
    try {
        const createLeagueResponse : CreateLeagueResponse = await leagueService.createLeague(values.name, Number(values.seasonId))
        if (createLeagueResponse.statusCode == 201) {
          navigate(`./league/${createLeagueResponse.league?.leagueId}`)
        } else if (createLeagueResponse.message) {
          setResponseError(createLeagueResponse.message);
        }
    } catch (error) {
      console.log(error)
    }
  };

  const onClickClose = () : void => {
    setShowCreateLeagueForm(false)
  }

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitDisabled,
  } = useForm<CreateLeagueFormData>({
    initialValues: { name: "", seasonId: "47" },
    validate: validateCreateLeague,
    onSubmit,
    requiredFields: ["name", "seasonId"],
  });

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl font-semibold text-gray-800 text-center">
          Create League Request
        </h2>
        <div
          onClick={onClickClose}
          className="cursor-pointer p-2 my-auto transition duration-300 transform hover:scale-105 hover:bg-red-200 active:bg-red-400 rounded-full"
          aria-label="Create League"
        >
          <img
            src={CloseIcon}
            alt="Create League"
            className="w-6 h-6 transition-colors duration-300"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className=" mx-auto">
        <div className="space-y-6">
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

          {responseError && (
            <p className="text-red-500 text-center py-2 px-4 border border-red-500 rounded-md bg-red-100">
              {responseError}
            </p>
          )}

          <div className="flex justify-center">
            <SubmitButton disabled={isSubmitDisabled} label="Create" />
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateLeagueForm;
