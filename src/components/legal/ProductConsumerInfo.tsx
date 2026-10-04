import { getProductInfoEntries, type ProductGuaranteeInfo } from '@/lib/consumer-guarantee';

/**
 * Producer-supplied information required when available (OUG 34/2014 art. 6
 * alin. (1) lit. l^3), m), u)). Renders nothing when no field is filled in.
 * The commercial guarantee is shown in ProductGuaranteeSection instead.
 */
export default function ProductConsumerInfo({ guarantee }: { guarantee: ProductGuaranteeInfo }) {
  const entries = getProductInfoEntries(guarantee).filter((entry) => entry.key !== 'commercialWarranty');
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="product-consumer-info-title" className="card" data-testid="product-consumer-info">
      <h2 id="product-consumer-info-title" className="mb-4 font-heading text-xl font-bold text-dark">
        Service, piese de schimb și reparare
      </h2>
      <dl className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.key}>
            <dt className="text-sm font-bold text-dark">{entry.title}</dt>
            <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed text-dark-300">{entry.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
