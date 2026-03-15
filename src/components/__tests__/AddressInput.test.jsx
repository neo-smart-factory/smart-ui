import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AddressInput from '../ui/AddressInput';
import { getAddress } from 'ethers';

const VALID_ADDRESS_LOWER = '0x742d35cc6634c0532925a3b844bc454e4438f44e';
const VALID_ADDRESS_CHECKSUM = getAddress(VALID_ADDRESS_LOWER);

describe('AddressInput', () => {
  it('renders with default label', () => {
    render(<AddressInput />);
    expect(screen.getByText('Wallet Address')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<AddressInput label="Recipient Address" />);
    expect(screen.getByText('Recipient Address')).toBeInTheDocument();
  });

  it('shows required indicator when required prop is true', () => {
    render(<AddressInput required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows no validation icons when value is empty', () => {
    render(<AddressInput value="" />);
    expect(screen.queryByTestId('valid-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('invalid-icon')).not.toBeInTheDocument();
  });

  it('shows check icon for a valid address', () => {
    render(<AddressInput value={VALID_ADDRESS_LOWER} />);
    // CheckCircle2 icon should be present for valid address
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    // Copy button is shown only for valid addresses
    expect(screen.getByTitle('Copy address')).toBeInTheDocument();
  });

  it('shows error message for address without 0x prefix', () => {
    render(<AddressInput value="742d35cc6634c0532925a3b844bc454e4438f44e" />);
    expect(screen.getByText(/Address must start with 0x/i)).toBeInTheDocument();
  });

  it('shows error message for address with wrong length', () => {
    render(<AddressInput value="0x1234" />);
    expect(screen.getByText(/Address must be exactly 42 characters/i)).toBeInTheDocument();
  });

  it('does not show copy button for invalid address', () => {
    render(<AddressInput value="0x1234" />);
    expect(screen.queryByTitle('Copy address')).not.toBeInTheDocument();
  });

  it('calls onChange with normalized address for valid input', () => {
    const onChange = vi.fn();
    render(<AddressInput onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: VALID_ADDRESS_LOWER } });

    expect(onChange).toHaveBeenCalledWith(VALID_ADDRESS_CHECKSUM, true);
  });

  it('calls onChange with raw value for invalid input', () => {
    const onChange = vi.fn();
    render(<AddressInput onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '0xinvalid' } });

    expect(onChange).toHaveBeenCalledWith('0xinvalid', false);
  });

  it('calls onChange with empty string and false when input is cleared', () => {
    const onChange = vi.fn();
    render(<AddressInput onChange={onChange} value="0xabc" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenCalledWith('', false);
  });

  it('renders input as disabled when disabled prop is true', () => {
    render(<AddressInput disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders with placeholder text', () => {
    render(<AddressInput placeholder="Enter address here" />);
    expect(screen.getByPlaceholderText('Enter address here')).toBeInTheDocument();
  });
});
