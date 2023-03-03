import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';

import useAuthentication from 'hooks/useAuthentication';
import * as URLS from 'config/urls';
import { LOGIN } from 'graphql/mutations/login';
import Form from 'components/Form';
import TextField from 'components/TextField';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
  fullName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const initialValue = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function SignUpForm() {
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const [login, { loading }] = useMutation(LOGIN);

  React.useEffect(() => {
    if (authentication.isAuthenticated) {
      navigate(URLS.DASHBOARD);
    }
  }, [authentication.isAuthenticated]);

  const handleSubmit = async (values: any) => {
    const { data } = await login({
      variables: {
        input: values,
      },
    });

    const { token } = data.login;

    authentication.updateToken(token);
  };

  //const render = React.useMemo(() => renderFields({ loading }), [loading]);

  return (
    <Paper sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.text.disabled,
          pb: 2,
          mb: 2,
        }}
        gutterBottom
      >
        Sign Up
      </Typography>

      <Form
        defaultValues={initialValue}
        onSubmit={handleSubmit}
        resolver={yupResolver(validationSchema)}
        mode="onChange"
        render={({ formState: { errors, touchedFields } }) => (
          <>
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              margin="dense"
              autoComplete="fullName"
              data-test="fullName-text-field"
              error={touchedFields.fullName && !!errors?.fullName}
              helperText={errors?.fullName?.message || ' '}
            />

            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="dense"
              autoComplete="email"
              data-test="email-text-field"
              error={touchedFields.email && !!errors?.email}
              helperText={errors?.email?.message || ' '}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              margin="dense"
              type="password"
              error={touchedFields.password && !!errors?.password}
              helperText={errors?.password?.message || ' '}
            />

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              margin="dense"
              type="password"
              error={touchedFields.confirmPassword && !!errors?.confirmPassword}
              helperText={errors?.confirmPassword?.message || ' '}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2, mt: 3 }}
              loading={loading}
              fullWidth
              data-test="signUp-button"
            >
              Sign Up
            </LoadingButton>
          </>
        )}
      />
    </Paper>
  );
}

export default SignUpForm;
