import * as i from '@acme/integration';

export const uuid = i.controls.text({
  placeholder: '00000000-0000-...',
});

export const email = i.controls.text({
  placeholder: 'john.doe@example.com',
});
