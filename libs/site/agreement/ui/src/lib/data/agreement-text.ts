export type AgreementClause = {
  /** Clause number as in the document, for example `1.9.3`. */
  number: string;
  text: string;
};

export type AgreementSection = {
  number: string;
  title: string;
  clauses: AgreementClause[];
};

export type AgreementText = {
  /** Preamble before section 1. */
  intro: string;
  sections: AgreementSection[];
};
