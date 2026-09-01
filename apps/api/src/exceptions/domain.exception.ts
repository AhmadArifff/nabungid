export class DomainException extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'DomainException';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationException extends DomainException {
  constructor(message = 'Validasi input gagal.', details?: any) {
    super(message, 400, details);
    this.name = 'ValidationException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message = 'Autentikasi gagal atau sesi telah berakhir.') {
    super(message, 401);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends DomainException {
  constructor(message = 'Akses ditolak: Anda tidak memiliki izin untuk tindakan ini.') {
    super(message, 403);
    this.name = 'ForbiddenException';
  }
}

export class NotFoundException extends DomainException {
  constructor(message = 'Data yang diminta tidak ditemukan.') {
    super(message, 404);
    this.name = 'NotFoundException';
  }
}

export class BusinessRuleException extends DomainException {
  constructor(message: string, details?: any) {
    super(message, 400, details);
    this.name = 'BusinessRuleException';
  }
}

export class InsufficientBalanceException extends BusinessRuleException {
  constructor(message = 'Saldo tabungan terverifikasi tidak mencukupi.') {
    super(message);
    this.name = 'InsufficientBalanceException';
  }
}

export class QuotaExceededException extends BusinessRuleException {
  constructor(message = 'Batas kuota frekuensi (1x penarikan) telah tercapai.') {
    super(message);
    this.name = 'QuotaExceededException';
  }
}
