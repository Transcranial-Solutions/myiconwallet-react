import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTextInput } from 'utils/useTextInput';
import Button from 'components/Button';
import { ErrorMessage, Input, InputGroup, Label } from 'components/Forms';
import { useIconService } from 'components/IconService';

function CreateWallet({ onCreateWallet }) {
  const { createWallet } = useIconService();
  const passwordInput = useTextInput('');
  const confirmPasswordInput = useTextInput('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (validate()) {
      setIsLoading(true);
      // setTimeout to ensure loading state shows before thread-locking createWallet call
      setTimeout(() => {
        const keystoreFile = createWallet(passwordInput.value);
        onCreateWallet(keystoreFile);
      }, 100);
    }
  }

  function validate() {
    const errors = {};
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!password) errors.password = 'Please enter your password.';
    else if (password.length < 8)
      errors.password = 'Please enter a password that is at least 8 characters long.';

    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (confirmPassword !== password)
      errors.confirmPassword = 'The passwords you entered are different.';

    setErrors(errors);
    return !errors.password && !errors.confirmPassword;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4">
        Enter and confirm a password for your wallet then click the 'Create' button. After your
        wallet is successfully created you will be prompted to download the keystore file for your
        new wallet.
      </p>

      <fieldset disabled={isLoading}>
        <InputGroup>
          <Label htmlFor="password">Enter your password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={passwordInput.value}
            onChange={(...args) => {
              if (errors.password) {
                setErrors({ ...errors, password: null });
              }
              passwordInput.onChange(...args);
            }}
            placeholder="eg. s0meth!ngsup3rsecre7"
            hasError={!!errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="confirmPassword">Confirm your password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPasswordInput.value}
            onChange={(...args) => {
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: null });
              }
              confirmPasswordInput.onChange(...args);
            }}
            placeholder="eg. s0meth!ngsup3rsecre7"
            hasError={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </InputGroup>

        <Button type="submit" disabled={isLoading}>
          Creat{isLoading ? 'ing' : 'e'} wallet
        </Button>
      </fieldset>
    </form>
  );
}

CreateWallet.propTypes = {
  onCreateWallet: PropTypes.func.isRequired,
};

export default CreateWallet;