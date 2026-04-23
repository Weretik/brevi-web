import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TableModule } from 'primeng/table';

type CharacteristicRow = {
  parameterKey: string;
  valueKey: string;
};

@Component({
  selector: 'lib-product-page-tabs-section',
  imports: [TranslocoPipe, TableModule],
  templateUrl: './product-page-tabs-section.html',
  styleUrl: './product-page-tabs-section.scss',
})
export class ProductPageTabsSection {
  activeTab = 0;

  readonly jacketCharacteristics: CharacteristicRow[] = [
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.collar.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.collar.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.cuff.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.cuff.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.sleeve.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.sleeve.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.centralClosure.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.centralClosure.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.lowerPockets.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.lowerPockets.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.upperPockets.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.upperPockets.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.additionalPockets.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.additionalPockets.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.yoke.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.yoke.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.reflectiveBand.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.reflectiveBand.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.decorativePiping.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.decorativePiping.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.bottomBelt.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.bottomBelt.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.jacket.rows.drawstring.parameter',
      valueKey: 'catalog.productPage.characteristics.jacket.rows.drawstring.value',
    },
  ];

  readonly overallsCharacteristics: CharacteristicRow[] = [
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.belt.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.belt.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.sidePockets.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.sidePockets.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.additionalPockets.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.additionalPockets.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.bibPocket.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.bibPocket.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.kneePads.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.kneePads.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.flyClosure.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.flyClosure.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.strapFasteners.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.strapFasteners.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.decorativePiping.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.decorativePiping.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.sideClosure.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.sideClosure.value',
    },
    {
      parameterKey: 'catalog.productPage.characteristics.overalls.rows.reflectiveBand.parameter',
      valueKey: 'catalog.productPage.characteristics.overalls.rows.reflectiveBand.value',
    },
  ];
}
