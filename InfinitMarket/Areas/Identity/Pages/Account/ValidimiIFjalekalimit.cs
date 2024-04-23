using System.ComponentModel.DataAnnotations;

namespace InfinitMarket.Areas.Identity.Pages.Account
{
    public class ValidimiIFjalekalimit : ValidationAttribute
    {
        private readonly int _minLength;
        private readonly int _maxLength;
        private readonly bool _requireDigit;
        private readonly bool _requireLowercase;
        private readonly bool _requireUppercase;
        private readonly bool _requireNonAlphanumeric;

        public ValidimiIFjalekalimit(int minLength, int maxLength, bool requireDigit, bool requireLowercase, bool requireUppercase, bool requireNonAlphanumeric)
        {
            _minLength = minLength;
            _maxLength = maxLength;
            _requireDigit = requireDigit;
            _requireLowercase = requireLowercase;
            _requireUppercase = requireUppercase;
            _requireNonAlphanumeric = requireNonAlphanumeric;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            string password = value as string;

            if (password.Length < _minLength || password.Length > _maxLength)
                return new ValidationResult($"Fjalekalimi duhet te jete midis {_minLength} dhe {_maxLength} karaktere i gjate.");

            if (_requireDigit && !password.Any(char.IsDigit))
                return new ValidationResult("Fjalekalimi duhet te permbaje se paku nje numer.");

            if (_requireLowercase && !password.Any(char.IsLower))
                return new ValidationResult("Fjalekalimi duhet te permbaje se paku nje shkronje te vogel.");

            if (_requireUppercase && !password.Any(char.IsUpper))
                return new ValidationResult("Fjalekalimi duhet te permbaje se paku nje shkronje te madhe.");

            if (_requireNonAlphanumeric && !password.Any(c => !char.IsLetterOrDigit(c)))
                return new ValidationResult("Fjalekalimi duhet te permbaje se paku nje simbol.");

            return ValidationResult.Success;
        }
    }
}
