import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';




// ----------------------------------------------------------------------

export default function ProfileView() {
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Profile</Typography>
      </Stack>
      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
      <div>Đây là trang cá nhân</div>

      </Stack>
    </Container>
  );
}
