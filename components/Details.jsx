import React, {Component} from 'react';
import Errors from './Errors.jsx';
import * as memberValidator from '../lib/memberValidator';
import countrySelector from '../public/javascript/countries.js';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.submitDetails = this.submitDetails.bind(this);
        this.getPersonalInformationSubtitletext = this.getPersonalInformationSubtitletext.bind(this);
        this.getResidentialAddressSubtitleText = this.getResidentialAddressSubtitleText.bind(this);
        this.handlePostalAddress = this.handlePostalAddress.bind(this);
        this.validator = memberValidator;
        this.state = { invalidFields: [],
                       showPostalAddress: false };
    }

    handlePostalAddress() {
      if (this.refs.differentPostal.checked){
        this.setState( { showPostalAddress: true } );
      } else {
        this.setState( { showPostalAddress: false } );
      }
    }

    componentDidMount() {
        countrySelector.populateCountries("residentialAddress[country]", "residentialAddress[state]");
        countrySelector.populateCountries("postalAddress[country]", "postalAddress[state]");

        countrySelector.setCountryAddress("residentialAddress[country]", this.props.formValues.residentialAddress.country, "residentialAddress[state]", this.props.formValues.residentialAddress.state);
        countrySelector.setCountryAddress("postalAddress[country]", this.props.formValues.postalAddress.country, "postalAddress[state]", this.props.formValues.postalAddress.state);
    }

    getPersonalInformationSubtitletext() {
      if(this.props.membershipType === "full") {
        return "Please enter your details exactly as they would appear on the electoral roll.";
      }
      return "Please enter your details";
    }

    getResidentialAddressSubtitleText() {
      if(this.props.membershipType === "full") {
        return "Please enter the address that you are enrolled to vote from.";
      }
      return "Please enter your address";
    }


    submitDetails() {
        var fieldValues = {
            membershipType: this.props.membershipType,
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value,
            dateOfBirth: this.refs.dateOfBirth.value,
            gender: this.refs.gender.value,
            email: this.refs.email.value,
            primaryPhoneNumber: this.refs.phoneNumber.value,
            secondaryPhone: this.refs.secondaryPhone.value,
            residentialAddress: {
                address: this.refs.residentialAddress.value,
                suburb: this.refs.residentialSuburb.value,
                country: this.refs.residentialCountry.value,
                state: this.refs.residentialState.value,
                postcode: this.refs.residentialPostcode.value
            },
            postalAddress: {
                address: this.refs.postalAddress.value,
                suburb: this.refs.postalSuburb.value,
                country: this.refs.postalCountry.value,
                state: this.refs.postalState.value,
                postcode: this.refs.postalPostcode.value
            }
        };
        if(!this.refs.differentPostal.checked) {
            fieldValues.postalAddress = fieldValues.residentialAddress;
        }
        var invalidFields = this.validator.isValid(fieldValues);
        if (invalidFields.length > 0) {
            return this.setState({invalidFields: invalidFields });
        }
        return this.props.saveAndContinue(fieldValues);
    }

    render() {
        return (
            <fieldset>
                <h1 className="form-title">Details</h1>
                <div className="form-body">
                    <Errors invalidFields={this.state.invalidFields} />
                    <div className="reminder">
                        <img src="/images/reminder.svg"></img>
                        <div className="reminder-text">
                            The information provided in this form may be used for the purpose of ensuring that the Pirate Party can register or remain registered as a political party in Australia, and its states and territories. <a href="/">View our Privacy Policy.</a>
                        </div>
                    </div>
                    <div className="heading">
                        <h2 className="sub-title"> Personal Information</h2>
                        <i>{this.getPersonalInformationSubtitletext()}</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="firstName">Given Name(s)*</label>
                        <input type="text" defaultValue={this.props.formValues.firstName} ref="firstName" id="firstName" className="firstName" />
                        <label htmlFor="lastName">Surname*</label>
                        <input type="text" defaultValue={this.props.formValues.lastName} ref="lastName" id="lastName" className="lastName" />
                        <label htmlFor="dateOfBirth">Date of Birth*</label>
                        <input type="text" defaultValue={this.props.formValues.dateOfBirth} ref="dateOfBirth" placeholder="DD/MM/YYYY" id="dateOfBirth" className="dateOfBirth" />
                        <label htmlFor="gender">Gender</label>
                        <input type="text" defaultValue={this.props.formValues.gender} ref="gender" id="gender" className="gender" />
                    </div>
                    <div className="heading">
                        <h2 className="sub-title"> Residential Address</h2>
                        <i>{this.getResidentialAddressSubtitleText()}</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="residentialAddress[address]">Address*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.address} ref="residentialAddress" id="residentialAddress[address]" className="residentialAddress" />
                        <label htmlFor="residentialAddress[suburb]">Suburb/City*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.suburb} ref="residentialSuburb" id="residentialAddress[suburb]" className="residentialSuburb" />
                        <label htmlFor="residentialAddress[country]">Country*</label>
                        <select defaultValue={this.props.formValues.residentialAddress.country} ref="residentialCountry" id="residentialAddress[country]" className="residentialCountry">
                        </select>

                        <div className="state-code">
                            <label htmlFor="residentialAddress[state]">State*</label>
                            <select defaultValue={this.props.formValues.residentialAddress.state} ref="residentialState" id="residentialAddress[state]" className="residentialState">
                                <option value="New South Wales">New South Wales</option>
                            </select>
                            <label htmlFor="residentialAddress[postcode]">Postcode*</label>
                            <input type="text" defaultValue={this.props.formValues.residentialAddress.postcode} ref="residentialPostcode" id="residentialAddress[postcode]" className="residentialPostcode" />
                        </div>
                        <label>
                            <input type="checkbox" onChange={this.handlePostalAddress} defaultValue={this.props.formValues.differentPostal} ref="differentPostal" value="Yes"/>
                            My residential address differs from my postal address.
                        </label>
                    </div>
                    <div id="postal-address" className={(() => { return this.state.showPostalAddress ? '' : 'hidden';})()}>
                        <div className="heading">
                            <h2 className="sub-title"> Postal Address</h2>
                            <i>Please enter the postal address.</i>
                        </div>
                        <div className="field-group">
                            <label htmlFor="postalAddress[address]">Address*</label>
                            <input type="text" defaultValue={this.props.formValues.postalAddress.address} ref="postalAddress" id="postalAddress" />
                            <label htmlFor="postalAddress[suburb]">Suburb*</label>
                            <input type="text" defaultValue={this.props.formValues.postalAddress.suburb} ref="postalSuburb" id="postalAddress[suburb]" />
                            <label htmlFor="postalAddress[country]">Country*</label>
                            <select defaultValue={this.props.formValues.postalAddress.country} ref="postalCountry" id="postalAddress[country]">
                            </select>

                            <div className="state-code">
                                <label htmlFor="postalAddress[state]">State*</label>
                                <select defaultValue={this.props.formValues.postalAddress.state} ref="postalState" id="postalAddress[state]">
                                </select>
                                <label htmlFor="postalAddress[postcode]">Postcode*</label>
                                <input type="text" defaultValue={this.props.formValues.postalAddress.postcode} ref="postalPostcode" id="postalAddress[postcode]" />
                            </div>
                        </div>
                    </div>
                    <div className="heading">
                        <h2 className="sub-title"> Contact Details</h2>
                        <i>Please enter your current email and phone number.</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email*</label>
                        <input type="text" defaultValue={this.props.formValues.email} ref="email" id="email" className="email" />
                        <label htmlFor="phoneNumber">Phone number*</label>
                        <input type="text" defaultValue={this.props.formValues.primaryPhoneNumber} ref="phoneNumber" id="primaryPhoneNumber" className="primaryPhoneNumber" />
                        <label htmlFor="phoneNumber">Secondary Phone</label>
                        <input type="text" defaultValue={this.props.formValues.secondaryPhone} ref="secondaryPhone" id="secondaryPhone" className="secondaryPhone" />
                    </div>
                    <div className="navigation">
                        <button onClick={this.submitDetails}>Continue</button>
                        <p>or <a id="go-back" onClick={this.props.previousStep}>go back</a></p>
                    </div>
                </div>
            </fieldset>
        )
    };
}
